import type { TripDay, TripItemType } from '../trips/types';

/**
 * Planifier un voyage = estimer une dépense globale réaliste, pas réserver.
 *
 * Chaque ligne de dépense appartient à une catégorie. Quand une fiche
 * (hôtel, guide, transport…) porte un prix réel, il prime. Sinon on applique
 * un barème par défaut selon le niveau de confort choisi par le voyageur.
 */

export type ComfortLevel = 'eco' | 'standard' | 'confort';

export type BudgetCategory =
  | 'hebergement'
  | 'nourriture'
  | 'transport'
  | 'guides'
  | 'activites'
  | 'autres';

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  'hebergement',
  'nourriture',
  'transport',
  'guides',
  'activites',
  'autres',
];

/** Barème indicatif en XOF (FCFA), par personne. Sources : ordres de grandeur terrain Burkina Faso. */
interface Scale {
  /** Nuitée par personne. */
  nuitee: number;
  /** Un repas par personne. */
  repas: number;
  /** Transport local par jour et par personne. */
  transportJour: number;
  /** Guide par jour (coût du guide, à partager dans le groupe). */
  guideJour: number;
  /** Enveloppe "activités / entrées de sites" par jour et par personne. */
  activitesJour: number;
}

export const COMFORT_SCALES: Record<ComfortLevel, Scale> = {
  eco: { nuitee: 8000, repas: 1500, transportJour: 3000, guideJour: 15000, activitesJour: 2000 },
  standard: { nuitee: 20000, repas: 4000, transportJour: 8000, guideJour: 25000, activitesJour: 5000 },
  confort: { nuitee: 45000, repas: 9000, transportJour: 20000, guideJour: 40000, activitesJour: 12000 },
};

export const DEFAULT_MEALS_PER_DAY = 3;

export interface BudgetLine {
  category: BudgetCategory;
  label: string;
  /** Coût unitaire retenu (réel si connu, sinon barème). */
  unitCost: number;
  quantity: number;
  /** true si unitCost vient d'une fiche, false s'il vient du barème. */
  fromRealPrice: boolean;
  /** Origine : "plan" (item ajouté aux jours) ou "auto" (ligne calculée). */
  source: 'plan' | 'auto';
}

export interface BudgetBreakdown {
  lines: BudgetLine[];
  byCategory: Record<BudgetCategory, number>;
  total: number;
  /** Nombre de nuits (0 si dates absentes ou séjour d'une journée). */
  nights: number;
  /** Nombre de jours sur place (au moins 1). */
  days: number;
  travelers: number;
}

const ITEM_TYPE_TO_CATEGORY: Partial<Record<TripItemType, BudgetCategory>> = {
  hotel: 'hebergement',
  restaurant: 'nourriture',
  guide: 'guides',
  transport: 'transport',
  experience: 'activites',
  event: 'activites',
  destination: 'activites',
  autre: 'autres',
};

export function computeNights(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  if (Number.isNaN(ms) || ms <= 0) return 0;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

interface BuildParams {
  days: TripDay[];
  startDate?: string;
  endDate?: string;
  comfort: ComfortLevel;
  travelers: number;
  /** Retire les lignes "auto" d'une catégorie si l'utilisateur préfère la piloter à la main. */
  disabledAutoCategories?: BudgetCategory[];
  /** Ajustements manuels du coût unitaire d'une ligne auto, par catégorie. */
  autoUnitOverrides?: Partial<Record<BudgetCategory, number>>;
}

/**
 * Construit la ventilation budgétaire :
 *  - une ligne par item du plan qui porte un `estimated_cost` (source "plan") ;
 *  - des lignes "auto" pour combler les postes non couverts par le plan
 *    (nuitées, repas, transport/jour, activités/jour) selon le barème.
 */
export function buildBudget(params: BuildParams): BudgetBreakdown {
  const {
    days,
    startDate,
    endDate,
    comfort,
    travelers,
    disabledAutoCategories = [],
    autoUnitOverrides = {},
  } = params;

  const scale = COMFORT_SCALES[comfort];
  const nights = computeNights(startDate, endDate);
  const daysOnSite = Math.max(nights > 0 ? nights + 1 : days.length || 1, 1);
  const people = Math.max(travelers, 1);

  const lines: BudgetLine[] = [];

  // 1. Lignes issues du plan (items avec un coût saisi).
  const plannedByCategory: Record<string, number> = {};
  for (const day of days) {
    for (const item of day.items) {
      if (typeof item.estimated_cost !== 'number' || item.estimated_cost <= 0) continue;
      const category = ITEM_TYPE_TO_CATEGORY[item.type] ?? 'autres';
      plannedByCategory[category] = (plannedByCategory[category] ?? 0) + 1;
      lines.push({
        category,
        label: item.title,
        unitCost: item.estimated_cost,
        quantity: 1,
        fromRealPrice: true,
        source: 'plan',
      });
    }
  }

  const isAutoOn = (c: BudgetCategory) => !disabledAutoCategories.includes(c);
  const autoUnit = (c: BudgetCategory, fallback: number) =>
    typeof autoUnitOverrides[c] === 'number' ? (autoUnitOverrides[c] as number) : fallback;

  // 2. Hébergement : compléter jusqu'à couvrir toutes les nuits, pour tout le groupe.
  if (nights > 0 && isAutoOn('hebergement') && !plannedByCategory['hebergement']) {
    lines.push({
      category: 'hebergement',
      label: `Nuitées (${nights} × ${people} pers.)`,
      unitCost: autoUnit('hebergement', scale.nuitee),
      quantity: nights * people,
      fromRealPrice: false,
      source: 'auto',
    });
  }

  // 3. Nourriture : repas/jour × jours × personnes, si non déjà couvert par le plan.
  if (isAutoOn('nourriture') && !plannedByCategory['nourriture']) {
    lines.push({
      category: 'nourriture',
      label: `Repas (${DEFAULT_MEALS_PER_DAY}/j × ${daysOnSite} j × ${people} pers.)`,
      unitCost: autoUnit('nourriture', scale.repas),
      quantity: DEFAULT_MEALS_PER_DAY * daysOnSite * people,
      fromRealPrice: false,
      source: 'auto',
    });
  }

  // 4. Transport local : par jour et par personne.
  if (isAutoOn('transport') && !plannedByCategory['transport']) {
    lines.push({
      category: 'transport',
      label: `Transport local (${daysOnSite} j × ${people} pers.)`,
      unitCost: autoUnit('transport', scale.transportJour),
      quantity: daysOnSite * people,
      fromRealPrice: false,
      source: 'auto',
    });
  }

  // 5. Activités / entrées : par jour et par personne.
  if (isAutoOn('activites') && !plannedByCategory['activites']) {
    lines.push({
      category: 'activites',
      label: `Activités & entrées (${daysOnSite} j × ${people} pers.)`,
      unitCost: autoUnit('activites', scale.activitesJour),
      quantity: daysOnSite * people,
      fromRealPrice: false,
      source: 'auto',
    });
  }

  const byCategory = BUDGET_CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c]: 0 }),
    {} as Record<BudgetCategory, number>,
  );
  for (const line of lines) {
    byCategory[line.category] += line.unitCost * line.quantity;
  }
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);

  return { lines, byCategory, total, nights, days: daysOnSite, travelers: people };
}

export function formatXof(amount: number): string {
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}
