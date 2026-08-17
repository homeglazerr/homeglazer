export type BlogAiArtifact = {
  outline?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  metaDescription?: string;
  metaKeywords?: string;
  categories?: string[];
  seoWarnings?: string[];
  humanized?: boolean;
};

/** Internal JSON fields while generation is in progress (Amplify ~30s API limit). */
export type BlogAiArtifactProgress = BlogAiArtifact & {
  _priorStatus?: 'topic_locked' | 'draft_ready';
  genPhase?: 'outline' | 'draft' | 'finalize';
  _seoFixDone?: boolean;
};

export type TopicJson = {
  title: string;
  rationale?: string;
  sourceNotes?: string;
};

export type ArticleBundleJson = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  metaDescription: string;
  metaKeywords: string;
  categories: string[];
};
