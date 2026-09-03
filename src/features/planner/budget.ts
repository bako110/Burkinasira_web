import type { GeoPoint, TripDay, TripItemType } from '../trips/types';

/**
 * Planifier un voyage = estimer une dépense globale réaliste, pas réserver.
 *
 * Chaque ligne de dépense appartient à une catégorie. Quand une fiche
 * (hôtel, guide, transport…) porte un prix réel, il prime. Sinon on applique
 * un barème par défaut selon le niveau de confort choisi par le voyageur.
 *
 * Le transport est estimé sur la distance réelle (haversine) entre les
 * étapes géolocalisées d'une même journée quand c'est possible, avec un
 * tarif au km distinct pour les trajets longue distance (bus interurbain)
 * et les déplacements urbains (taxi/moto-taxi). À défaut de coordonnées,
 * on retombe sur un forfait journalier par barème de confort.
 */

export type ComfortLevel = 'eco' | 'standard' | 'confort';

export type BudgetCategory =
  | 'international'
  | 'hebergement'
  | 'nourriture'
  | 'transport'
  | 'guides'
  | 'activites'
  | 'autres';

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  'international',
  'hebergement',
  'nourriture',
  'transport',
  'guides',
  'activites',
  'autres',
];

/**
 * Région de provenance du touriste, pour estimer le trajet international
 * (vol aller-retour + visa) jusqu'à Ouagadougou. Regroupement par zone
 * géographique plutôt que par pays : suffisant pour un ordre de grandeur,
 * un pays précis par région ne changerait pas la décision budgétaire.
 */
export type OriginRegion =
  | 'burkina_faso'
  | 'cedeao'
  | 'afrique_autre'
  | 'europe'
  | 'amerique_nord'
  | 'moyen_orient'
  | 'asie'
  | 'oceanie';

export const ORIGIN_REGIONS: OriginRegion[] = [
  'burkina_faso',
  'cedeao',
  'afrique_autre',
  'europe',
  'amerique_nord',
  'moyen_orient',
  'asie',
  'oceanie',
];

interface InternationalCost {
  /** Vol aller-retour jusqu'à Ouagadougou, par personne, en FCFA. */
  flightRoundTrip: number;
  /** Visa touristique, par personne, en FCFA (0 si exempté, ex. CEDEAO). */
  visa: number;
}

/**
 * Coûts d'accès au Burkina Faso par zone de départ, en XOF (FCFA).
 * Sources (2026) : recherches de tarifs de vols AR vers Ouagadougou par zone
 * (Air France, Brussels Airlines, Ethiopian, Royal Air Maroc, comparateurs),
 * et grille e-Visa Burkina Faso (~84-143€ pour un visa touristique simple
 * entrée, exemption totale pour les ressortissants CEDEAO <90 jours).
 * Fourchettes larges par nature : un vol dépend fortement de la saison et
 * de la date de réservation, retenu ici à un niveau médian réaliste.
 */
export const INTERNATIONAL_COSTS: Record<OriginRegion, InternationalCost> = {
  burkina_faso: { flightRoundTrip: 0, visa: 0 },
  cedeao: { flightRoundTrip: 200000, visa: 0 },
  afrique_autre: { flightRoundTrip: 320000, visa: 50000 },
  europe: { flightRoundTrip: 450000, visa: 55000 },
  amerique_nord: { flightRoundTrip: 500000, visa: 55000 },
  moyen_orient: { flightRoundTrip: 400000, visa: 55000 },
  asie: { flightRoundTrip: 550000, visa: 55000 },
  oceanie: { flightRoundTrip: 700000, visa: 55000 },
};

/**
 * Barème indicatif en XOF (FCFA), par personne.
 * Sources (2026) : prix carburant (essence 850 F/L, gasoil 750 F/L),
 * tickets bus interurbains Rakieta/TSR/STAF (~18-20 F/km, ex. Bobo-Ouaga
 * 360km ≈ 6500-8000 F), repas restaurant (2000-5000 F en moyenne),
 * taxi urbain (~800-1000 F/km, courses moto-taxi courtes ~300-500 F).
 */
interface Scale {
  /** Nuitée par personne. */
  nuitee: number;
  /** Un repas par personne. */
  repas: number;
  /** Transport local (intra-ville) par jour et par personne, à défaut de distance connue. */
  transportJour: number;
  /** Tarif transport urbain, FCFA par km. */
  transportUrbainParKm: number;
  /** Tarif transport interurbain (bus/car), FCFA par km. */
  transportInterurbainParKm: number;
  /** Guide par jour (coût du guide, à partager dans le groupe). */
  guideJour: number;
  /** Enveloppe "activités / entrées de sites" par jour et par personne. */
  activitesJour: number;
}

export const COMFORT_SCALES: Record<ComfortLevel, Scale> = {
  eco: {
    nuitee: 10000,
    repas: 2000,
    transportJour: 2000,
    transportUrbainParKm: 300,
    transportInterurbainParKm: 18,
    guideJour: 15000,
    activitesJour: 2000,
  },
  standard: {
    nuitee: 22000,
    repas: 3500,
    transportJour: 4000,
    transportUrbainParKm: 800,
    transportInterurbainParKm: 20,
    guideJour: 25000,
    activitesJour: 5000,
  },
  confort: {
    nuitee: 50000,
    repas: 7000,
    transportJour: 10000,
    transportUrbainParKm: 1200,
    transportInterurbainParKm: 25,
    guideJour: 40000,
    activitesJour: 12000,
  },
};

export const DEFAULT_MEALS_PER_DAY = 3;

/** Au-delà de cette distance entre deux étapes, on applique le tarif interurbain (bus/car) plutôt qu'urbain. */
const INTERURBAIN_THRESHOLD_KM = 30;

export interface BudgetLine {
  category: BudgetCategory;
  label: string;
  /** Coût unitaire retenu (réel si connu, sinon barème). */
  unitCost: number;
  quantity: number;
  /** true si unitCost vient d'une fiche, false s'il vient du barème. */
  fromRealPrice: boolean;
  /** Origine : "plan" (item ajouté aux jours), "distance" (calculé sur trajet réel) ou "auto" (forfait). */
  source: 'plan' | 'distance' | 'auto';
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
  /** Distance totale (km) calculée entre étapes géolocalisées, toutes journées confondues. */
  totalDistanceKm: number;
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

/** Distance à vol d'oiseau entre deux points GPS (km), formule de haversine. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance routière approximative : majore la distance à vol d'oiseau (routes rarement rectilignes). */
function roadDistanceKm(a: GeoPoint, b: GeoPoint): number {
  return haversineKm(a, b) * 1.3;
}

interface BuildParams {
  days: TripDay[];
  startDate?: string;
  endDate?: string;
  comfort: ComfortLevel;
  travelers: number;
  /** Région de provenance du touriste ; ajoute une ligne vol + visa si renseignée et différente du Burkina Faso. */
  originRegion?: OriginRegion;
  /** Retire les lignes "auto" d'une catégorie si l'utilisateur préfère la piloter à la main. */
  disabledAutoCategories?: BudgetCategory[];
  /** Ajustements manuels du coût unitaire d'une ligne auto, par catégorie. */
  autoUnitOverrides?: Partial<Record<BudgetCategory, number>>;
}

/**
 * Construit la ventilation budgétaire :
 *  - une ligne par item du plan qui porte un `estimated_cost` (source "plan") ;
 *  - une ligne "distance" par trajet réel entre étapes géolocalisées d'un même jour ;
 *  - des lignes "auto" pour combler les postes non couverts (nuitées, repas,
 *    transport résiduel sans coordonnées, activités) selon le barème.
 */
export function buildBudget(params: BuildParams): BudgetBreakdown {
  const {
    days,
    startDate,
    endDate,
    comfort,
    travelers,
    originRegion,
    disabledAutoCategories = [],
    autoUnitOverrides = {},
  } = params;

  const scale = COMFORT_SCALES[comfort];
  const nights = computeNights(startDate, endDate);
  const daysOnSite = Math.max(nights > 0 ? nights + 1 : days.length || 1, 1);
  const people = Math.max(travelers, 1);

  const lines: BudgetLine[] = [];
  let totalDistanceKm = 0;

  const isAutoOn = (c: BudgetCategory) => !disabledAutoCategories.includes(c);
  const autoUnit = (c: BudgetCategory, fallback: number) =>
    typeof autoUnitOverrides[c] === 'number' ? (autoUnitOverrides[c] as number) : fallback;

  // 0. Trajet international : vol aller-retour + visa, par personne, selon la région de départ.
  if (originRegion && originRegion !== 'burkina_faso' && isAutoOn('international')) {
    const { flightRoundTrip, visa } = INTERNATIONAL_COSTS[originRegion];
    if (flightRoundTrip > 0) {
      lines.push({
        category: 'international',
        label: `Vol aller-retour (${people} pers.)`,
        unitCost: autoUnit('international', flightRoundTrip),
        quantity: people,
        fromRealPrice: false,
        source: 'auto',
      });
    }
    if (visa > 0) {
      lines.push({
        category: 'international',
        label: `Visa touristique (${people} pers.)`,
        unitCost: visa,
        quantity: people,
        fromRealPrice: false,
        source: 'auto',
      });
    }
  }

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

  // 2. Transport réel : distance entre étapes géolocalisées successives d'un même jour.
  const isTransportAutoOn = isAutoOn('transport');
  let distanceCovered = false;
  if (isTransportAutoOn) {
    for (const day of days) {
      const located = day.items.filter((item): item is typeof item & { location: GeoPoint } => !!item.location);
      for (let i = 0; i < located.length - 1; i += 1) {
        const from = located[i];
        const to = located[i + 1];
        const km = roadDistanceKm(from.location, to.location);
        if (km < 0.5) continue; // même lieu, pas de trajet à compter
        distanceCovered = true;
        totalDistanceKm += km;
        const perKm = km > INTERURBAIN_THRESHOLD_KM ? scale.transportInterurbainParKm : scale.transportUrbainParKm;
        lines.push({
          category: 'transport',
          label: `${from.title} → ${to.title} (${Math.round(km)} km)`,
          unitCost: autoUnit('transport', perKm) * km,
          quantity: people,
          fromRealPrice: false,
          source: 'distance',
        });
      }
    }
  }

  // 3. Hébergement : compléter jusqu'à couvrir toutes les nuits, pour tout le groupe.
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

  // 4. Nourriture : repas/jour × jours × personnes, si non déjà couvert par le plan.
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

  // 5. Transport résiduel : forfait journalier uniquement si aucune distance réelle n'a pu être calculée.
  if (isTransportAutoOn && !plannedByCategory['transport'] && !distanceCovered) {
    lines.push({
      category: 'transport',
      label: `Transport local (${daysOnSite} j × ${people} pers.)`,
      unitCost: autoUnit('transport', scale.transportJour),
      quantity: daysOnSite * people,
      fromRealPrice: false,
      source: 'auto',
    });
  }

  // 6. Activités / entrées : par jour et par personne.
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

  return { lines, byCategory, total, nights, days: daysOnSite, travelers: people, totalDistanceKm };
}

export function formatXof(amount: number): string {
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}
