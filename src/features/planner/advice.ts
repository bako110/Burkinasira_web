/**
 * Conseils pratiques pour un voyage au Burkina Faso.
 *
 * Objectif : accompagner le voyageur de la préparation jusqu'au retour, sans
 * mauvaise surprise. Les textes sont volontairement concrets et neutres ;
 * ils ne remplacent pas les sources officielles (ambassade, OMS, autorités).
 *
 * `i18nKey` pointe vers `advice.<phase>.<id>` dans les fichiers de langue.
 */

export type AdvicePhase = 'before' | 'during' | 'after';

export interface AdviceItem {
  id: string;
  /** Icône lucide-react (nom d'export). */
  icon:
    | 'FileCheck'
    | 'Syringe'
    | 'CalendarRange'
    | 'Wallet'
    | 'ShieldCheck'
    | 'Plug'
    | 'Languages'
    | 'HeartPulse'
    | 'Sun'
    | 'HandHeart'
    | 'Phone'
    | 'Luggage'
    | 'Camera'
    | 'MessageSquareHeart';
  phase: AdvicePhase;
}

export const ADVICE_ITEMS: AdviceItem[] = [
  // --- Avant le départ ---
  { id: 'visa', icon: 'FileCheck', phase: 'before' },
  { id: 'vaccines', icon: 'Syringe', phase: 'before' },
  { id: 'season', icon: 'CalendarRange', phase: 'before' },
  { id: 'money', icon: 'Wallet', phase: 'before' },
  { id: 'security', icon: 'ShieldCheck', phase: 'before' },
  { id: 'packing', icon: 'Luggage', phase: 'before' },

  // --- Sur place ---
  { id: 'health', icon: 'HeartPulse', phase: 'during' },
  { id: 'heat', icon: 'Sun', phase: 'during' },
  { id: 'customs', icon: 'HandHeart', phase: 'during' },
  { id: 'bargaining', icon: 'Wallet', phase: 'during' },
  { id: 'connectivity', icon: 'Plug', phase: 'during' },
  { id: 'language', icon: 'Languages', phase: 'during' },
  { id: 'photos', icon: 'Camera', phase: 'during' },
  { id: 'emergency', icon: 'Phone', phase: 'during' },

  // --- Au retour ---
  { id: 'healthWatch', icon: 'HeartPulse', phase: 'after' },
  { id: 'feedback', icon: 'MessageSquareHeart', phase: 'after' },
];

export const ADVICE_PHASES: AdvicePhase[] = ['before', 'during', 'after'];

export function adviceByPhase(phase: AdvicePhase): AdviceItem[] {
  return ADVICE_ITEMS.filter((a) => a.phase === phase);
}
