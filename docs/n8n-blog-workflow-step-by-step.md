# n8n blog automation: detailed click-by-click guide

This document is a **literal UI walkthrough**: Google Sheet setup (names and cells), **Telegram bot**, then n8n **AI Agent** workflow (Telegram message in, agent uses tools, replies in Telegram). Your n8n version may label buttons slightly differently; use the **search box** in the add-node panel and type the node name.

**Primary path (what you should build):**

- One Google Sheet: `Blog_Pipeline_Master` with tabs **`Clients`** (who may use the bot), **`Topics`**, **`Approved_Content`**.
- One main workflow: **`Telegram_Blog_Agent`** — **Telegram Trigger** → (optional allowlist) → **AI Agent** + **Chat Model** + **Memory** + **Tools** (Google Sheets, HTTP/RSS, draft/humanise chains) → **Telegram** send reply.

**Appendix** at the end keeps a **short** optional manual workflow pattern for debugging only (Manual Trigger + separate schedulers). Day-to-day operation is **all in Telegram**.

---

## Part A - Create the Google Sheet (every click)

**A1. Open Google Sheets**

1. Go to `https://sheets.google.com`
2. Log in with the Google account that will own this file.
3. Click **Blank** (or **+** to create a new spreadsheet).

**A2. Name the spreadsheet**

1. Click the title at the top left (it says **Untitled spreadsheet**).
2. Type: `Blog_Pipeline_Master`
3. Press **Enter**.

**A3. First tab: rename to `Clients` (allowlist for external clients)**

1. At the bottom, find the tab **Sheet1**.
2. Right-click the tab then **Rename**.
3. Type exactly: `Clients`
4. Press **Enter**.

**A4. Tab `Clients`: type column headers in row 1**

| Cell | Type this exact header |
|------|-------------------------|
| A1 | `telegram_user_id` |
| B1 | `telegram_username` |
| C1 | `client_name` |
| D1 | `client_email` |
| E1 | `active` |

- Put each client on their own row. **`telegram_user_id`** is a number Telegram gives you (see Part D). **`active`** = `yes` or `TRUE` for allowed users; anything else = block.
- When someone new messages the bot, you add a row here (or build a later onboarding flow).

**A5. Second tab: add `Topics`**

1. Click the **+** at the bottom to add a sheet.
2. Rename the tab to exactly: `Topics`

**A6. Tab `Topics`: type column headers in row 1**

| Cell | Type this exact header |
|------|-------------------------|
| A1 | `request_id` |
| B1 | `requested_at` |
| C1 | `client_name` |
| D1 | `client_email` |
| E1 | `brief` |
| F1 | `trend_candidates` |
| G1 | `selected_topic` |
| H1 | `selected_at` |
| I1 | `status` |
| J1 | `draft_notes` |
| K1 | `draft_started` |
| L1 | `telegram_chat_id` |

Column **`telegram_chat_id`** links a request row to the Telegram chat (so the agent can continue the same thread). Optional but recommended.

**Status values** for column `I` (`status`):

`awaiting_selection` then `selected` then `drafting` then `awaiting_approval` then `done` (or `rejected`).

**A7. Third tab: add `Approved_Content`**

1. Add another sheet with **+**.
2. Rename to exactly: `Approved_Content`

**A8. Tab `Approved_Content`: type column headers in row 1**

| Cell | Type this exact header |
|------|-------------------------|
| A1 | `request_id` |
| B1 | `approved_at` |
| C1 | `title` |
| D1 | `slug` |
| E1 | `excerpt` |
| F1 | `content` |
| G1 | `meta_description` |
| H1 | `meta_keywords` |
| I1 | `read_time` |
| J1 | `cover_image_url` |
| K1 | `notes` |
| L1 | `published_to_site` |

**A9. Copy the Spreadsheet ID (you will paste it into n8n)**

1. Browser URL: `https://docs.google.com/spreadsheets/d/THIS_LONG_STRING_IS_THE_ID/edit`
2. Copy only the id between `/d/` and `/edit`.
3. Save as `Blog_Pipeline_Master_ID`.

**A10. Share the sheet with n8n**

1. Same as before: OAuth with the Google account that owns the sheet, or share with a **service account** email as **Editor** for production.

---

## Part B - Google Cloud credential for Google Sheets in n8n (OAuth)

Skip this if your n8n already has Google Sheets working.

**B1. In Google Cloud Console**

1. Open `https://console.cloud.google.com`
2. Create or pick a **Project**.
3. **APIs and services** → **Library** → enable **Google Sheets API** (and **Google Drive API** if n8n docs require it for Sheets).
4. **OAuth consent screen** — complete it. For external users, add **Test users** (their Gmail) while in Testing, or publish when ready.
5. **Credentials** → **Create credentials** → **OAuth client ID** → type **Web application**.
6. **Authorized JavaScript origins:** base URL of n8n only, e.g. `https://your-app.up.railway.app` (no path).
7. **Authorized redirect URIs:** copy **exactly** from n8n’s Google Sheets credential screen (**OAuth Redirect URL** field).
8. Create; copy **Client ID** and **Client Secret**.

**B2. In n8n**

1. **Credentials** → **Add credential** → **Google Sheets OAuth2 API** (or equivalent).
2. Paste Client ID / Secret → **Connect** / **Sign in with Google** → Save as e.g. `google_sheets_homeglazer`.

---

## Part C - OpenAI (or other LLM) credential in n8n

1. **Credentials** → **Add credential** → search **OpenAI**.
2. Paste API key → Save as e.g. `openai_main`.

---

## Part D - Telegram bot and n8n Telegram credential

**D1. Create the bot (BotFather)**

1. In Telegram, open chat with **@BotFather**.
2. Send `/newbot` and follow prompts.
3. Choose a **name** and a **username** (must end in `bot`).
4. Copy the **HTTP API token** BotFather gives you (keep it secret).

**D2. Get a user’s `telegram_user_id` (for the `Clients` sheet)**

1. Have the client message your bot once (or message **@userinfobot** from their account).
2. Use any safe method you prefer to read their numeric **user id** (many tutorials use **@RawDataBot** or your n8n **Telegram Trigger** test run: execute workflow once and inspect the JSON — look for `message.from.id`).
3. Add that number to **`Clients`!A** and set **`active`** to yes.

**D3. n8n Telegram credential**

1. **Credentials** → **Add credential** → search **Telegram**.
2. Paste the **Access Token** from BotFather.
3. Save as e.g. `telegram_blog_bot`.

**D4. Railway / public URL (webhook)**

Telegram needs **HTTPS**. On Railway (or similar), set n8n env vars per hosting docs so the public URL is stable, e.g. **`WEBHOOK_URL`** = `https://your-service.up.railway.app` (exact variable names depend on your n8n image). After deploy, **activate** the workflow so Telegram can register the webhook.

---

## Part E - Main workflow: `Telegram_Blog_Agent`

Goal: every **incoming Telegram message** runs one workflow; the **AI Agent** decides what to do and answers in Telegram.

**E1. Create workflow**

1. **Workflows** → **Add workflow**.
2. Rename to: `Telegram_Blog_Agent`
3. **Save**.

**E2. First node: Telegram Trigger**

1. **Add first step** → search **Telegram Trigger** (or **Telegram** trigger).
2. **Credential:** `telegram_blog_bot`.
3. **Updates:** enable **message** (at minimum).
4. **Save**. Turn workflow **Active** when you are ready to receive live messages (after testing).

**E3. Optional but recommended: allowlist check**

1. Add **Google Sheets** → **Read Rows** from tab **`Clients`** (or **Lookup** if you filter by `telegram_user_id`).
2. Add **Code** or **IF**: compare `{{ $json.message.from.id }}` (from Telegram) to column `telegram_user_id` where `active` is yes.
3. If not allowed: **Telegram** node → **Send Message** → “You are not registered for this service.” → **Stop** (no Agent).

Wire the **allowed** branch into the Agent path below.

**E4. AI Agent node**

1. After the allowlist branch, add **AI Agent** (search **Agent** — often under LangChain; name may be **AI Agent**).
2. Connect these to the Agent’s sub-panels (n8n shows **Chat Model**, **Memory**, **Tools** inputs):

   - **Chat Model:** add **OpenAI Chat Model** (or compatible). Credential: `openai_main`. Pick a model (e.g. `gpt-4o-mini` or your choice).
   - **Memory:** add **Window Buffer Memory** (or **Conversation ID** = expression using `{{ $json.message.chat.id }}` so each chat keeps its own context).
   - **Tools:** connect the tools you build in **Part F** (each tool is a node the agent can call).

3. **Prompt / system message** (summarize in the Agent settings): You are a blog assistant for HomeGlazer (or your brand). You must:

   - Greet briefly; if you do not have **brief** yet, ask what topics or audience they care about.
   - When you have a brief, use tools to **fetch trends** (HTTP/RSS tool) and propose a **numbered shortlist** in Telegram.
   - When the user picks a topic (number or text), use tools to **append or update** the **`Topics`** sheet (`request_id`, `brief`, `trend_candidates`, `selected_topic`, `status`, `telegram_chat_id`, timestamps).
   - Run **outline → draft → humanisation** (via tools or chained sub-workflows — Part F). **Only send the humanised draft** to the user.
   - Ask for **approve** or **revise**. On approve, tool **append `Approved_Content`** and set **`Topics.status`** to `done`.

   Keep replies **short** in Telegram; offer “full draft in next message” if over length limits.

**E5. Reply on Telegram**

1. The Agent node usually outputs text for the assistant.
2. Add **Telegram** → **Send Message** (or **Reply**).
3. **Chat ID:** `{{ $json.message.chat.id }}` (from the **Telegram Trigger** item — you may need `{{ $('Telegram Trigger').item.json.message.chat.id }}` if the Agent drops fields).
4. **Text:** map from Agent output (expression depends on node names).

If the message is **too long** for Telegram (~4096 chars), add a **Code** node to split into chunks and loop **Send Message**.

**E6. Save and activate**

1. **Save** workflow.
2. **Active** ON.
3. Message your bot from an allowed account; confirm you get a reply.

---

## Part F - Agent tools (what to attach to the AI Agent)

Tools are **separate nodes** wired into the Agent’s **Tools** connector. Exact names vary (**Google Sheets Tool**, **HTTP Request Tool**, **Workflow Tool**, etc.). Below is the **logical** set; in n8n, search for “Tool” after adding the Agent.

**F1. Sheet tool: append `Topics` row**

- Wrap a **Google Sheets** append (same column mapping as before) so inputs are: `request_id`, `client_name`, `client_email`, `brief`, `trend_candidates`, `status`, `telegram_chat_id`, etc.
- Or use **Execute Workflow** from a Tool node calling a small sub-workflow that only appends.

**F2. Sheet tool: update `Topics` by `request_id`**

- Set `selected_topic`, `selected_at`, `status=selected`, etc., when user picks a topic.

**F3. Sheet tool: read `Topics` for this chat**

- Filter rows where `telegram_chat_id` matches current chat or latest `request_id` you are tracking in memory.

**F4. Trend tool**

- **HTTP Request Tool** to RSS or news URL, or a sub-workflow that returns plain text headlines for the agent to rank in its reply.

**F5. Draft + humanisation tools (recommended pattern)**

- **Workflow Tool** → sub-workflow **inputs:** `selected_topic`, `brief`, optional research text. **Steps inside:** OpenAI outline → OpenAI draft → OpenAI **humanisation** (separate node, lower temperature, editor system prompt: ban AI filler words, keep facts). **Output:** `title`, `slug`, `excerpt`, `content`, `meta_description`, `meta_keywords`, `read_time`, `cover_image_url` (default URL if none).
- Agent calls this once per draft request.

**F6. Approve tool**

- Sub-workflow: append **`Approved_Content`**, update **`Topics`** to `status=done` when user confirms approval in text.

**F7. Guardrails**

- In **Code** tools or before Sheet writes: validate **slug** `^[a-z0-9-]+$`, trim fields, never write empty `content` to `Approved_Content`.

---

## Part G - How nodes connect (visual rule)

1. **Telegram Trigger** outputs one item per message; note **`message.chat.id`** and **`message.from.id`** for expressions.
2. **AI Agent** has multiple inputs: connect **Chat Model**, **Memory**, and each **Tool** to the matching Agent input ports.
3. After Agent, **Telegram Send** uses the same **chat id** as the user.
4. For debugging, use **Execute workflow** on **Telegram Trigger** with a pinned sample JSON.

---

## Part H - Testing checklist

- [ ] Sheet has three tabs: **`Clients`**, **`Topics`**, **`Approved_Content`** with headers exactly as in Part A.
- [ ] Your Telegram user id is in **`Clients`** with **`active`** = yes.
- [ ] Google + OpenAI + Telegram credentials work.
- [ ] **`Telegram_Blog_Agent`** is **Active**; Railway URL is HTTPS and webhook env vars set.
- [ ] Agent returns a shortlist, can record a topic to **`Topics`**, produces **humanised** draft text, and on “approve” appends **`Approved_Content`**.

---

## Note on n8n UI versions

- LangChain nodes (**AI Agent**, **Tools**, **Memory**) require a recent n8n with AI features enabled.
- If a node name differs, search the **node panel** for **Agent**, **Telegram**, **OpenAI**, **Google Sheets**, **Tool**.

---

## Appendix - Optional manual debugging workflows (not for clients)

Use only if you want to test Sheets without Telegram.

**A1.** Workflow with **Manual Trigger** → **Set** (fake `client_name`, `brief`) → **Google Sheets** append **`Topics`**.

**A2.** Workflow with **Schedule Trigger** → read **`Topics`** where `status=selected` → draft nodes → append **`Approved_Content`**.

Do **not** ask clients to use these; production is **Telegram + Agent** only.

---

## Reference - column lists (copy/paste into row 1)

**Clients:**  
`telegram_user_id` | `telegram_username` | `client_name` | `client_email` | `active`

**Topics:**  
`request_id` | `requested_at` | `client_name` | `client_email` | `brief` | `trend_candidates` | `selected_topic` | `selected_at` | `status` | `draft_notes` | `draft_started` | `telegram_chat_id`

**Approved_Content:**  
`request_id` | `approved_at` | `title` | `slug` | `excerpt` | `content` | `meta_description` | `meta_keywords` | `read_time` | `cover_image_url` | `notes` | `published_to_site`

---

Export tips: copy this file to `.txt` or open in Word and save as `.docx` if needed.
