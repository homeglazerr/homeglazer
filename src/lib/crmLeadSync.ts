export interface CRMLeadData {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  status?: string;
  company?: string;
  notes?: string;
}

export async function sendLeadToCRM(data: CRMLeadData): Promise<boolean> {
  const crmUrl = process.env.CRM_API_URL || 'http://localhost:8000/api/website-leads';
  const crmApiKey = process.env.CRM_API_KEY || 'hgak84j48h495hsnfu3bsknl';
  const crmCompanyId = process.env.CRM_COMPANY_ID || '1';

  try {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company_id: Number(crmCompanyId), // Secure HomeGlazer Org (ID: 1)
      source: data.source || 'website',
      status: data.status || 'new',
      company: data.company || '',
      notes: data.notes || '',
    };

    const response = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': crmApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[CRM Lead Sync] Lead for ${data.email} synced successfully to HomeGlazer Org #${crmCompanyId}.`);
      return true;
    } else {
      const errText = await response.text();
      console.error(`[CRM Lead Sync Error] HTTP ${response.status}: ${errText}`);
      return false;
    }
  } catch (error: any) {
    console.error('[CRM Lead Sync Exception]:', error?.message || error);
    return false;
  }
}
