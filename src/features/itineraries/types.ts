import type { TripItemType } from '../trips/types';

/**
 * Un itinéraire premium est un voyage entièrement composé par la rédaction
 * BurkinaSira : jour par jour, étapes qualifiées, budget indicatif par niveau de
 * confort. Le voyageur le « clone » : on crée alors un Trip réel qu'il
 * personnalise ensuite dans le planificateur.
 */

export type ItineraryPace = 'tranquille' | 'equilibre' | 'intense';

export interface ItineraryStop {
  /** Moment indicatif de la journée. */
  time?: string;
  type: TripItemType;
  title: string;
  /** Description soignée : ce qu'on y vit, pourquoi ça vaut le détour. */
  description: string;
  /** Coût indicatif par personne en XOF (0 = gratuit / inclus ailleurs). */
  estimatedCost?: number;
  /** Slug d'une destination réelle, si l'étape y correspond (lien fiche). */
  destinationSlug?: string;
  /** Conseil pratique court affiché « à côté » de l'étape. */
  tip?: string;
}

export interface ItineraryDay {
  /** Titre de la journée : « Jour 1 — Ouagadougou, entrée en matière ». */
  title: string;
  /** Résumé de la journée, 1 à 2 phrases. */
  summary: string;
  stops: ItineraryStop[];
}

export interface Itinerary {
  slug: string;
  title: string;
  /** Accroche courte pour les cartes. */
  tagline: string;
  /** Paragraphe d'introduction éditorial. */
  intro: string;
  region: string;
  durationDays: number;
  pace: ItineraryPace;
  /** Pour qui ce voyage est fait (couples, familles, passionnés de culture…). */
  audience: string[];
  /** Meilleure période conseillée. */
  bestSeason: string;
  /** Points forts mis en avant sur la carte et en tête de fiche. */
  highlights: string[];
  /** Image de couverture (URL distante autorisée par la CSP de l'app native). */
  cover: string;
  /** Fourchette de budget par personne selon le niveau de confort, en XOF. */
  budgetFrom: { eco: number; standard: number; confort: number };
  days: ItineraryDay[];
  /** Ce que le voyage n'inclut pas (transparence). */
  notIncluded: string[];
}
