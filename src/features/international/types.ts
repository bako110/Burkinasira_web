export type FirstVisitGuideCategory =
  | 'culture_usages'
  | 'monnaie'
  | 'formalites'
  | 'sante_securite'
  | 'transport';

export interface GuideEntry {
  id: string;
  category: FirstVisitGuideCategory;
  title: string;
  content: string;
  language: string;
  updated_at: string;
}
