import type { TripSummary } from './types';

const MS_PER_DAY = 86_400_000;

/** Numéro de jour (UTC) d'une date ISO : évite les décalages de fuseau dans les écarts en jours. */
function dayNumber(iso: string): number {
  return Math.floor(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / MS_PER_DAY);
}

function todayNumber(): number {
  const n = new Date();
  return Math.floor(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / MS_PER_DAY);
}

export type TripPhase = 'draft' | 'upcoming' | 'ongoing' | 'past';

export interface TripTiming {
  phase: TripPhase;
  /** Jours avant le départ (phase « upcoming » avec date de début). */
  daysUntil?: number;
  /** Durée du voyage en jours, si les deux dates sont connues. */
  duration?: number;
}

export function getTripTiming(trip: TripSummary): TripTiming {
  const duration =
    trip.start_date && trip.end_date ? dayNumber(trip.end_date) - dayNumber(trip.start_date) + 1 : undefined;

  if (trip.status === 'draft') return { phase: 'draft', duration };
  if (trip.status === 'completed' || trip.status === 'cancelled') return { phase: 'past', duration };

  if (trip.start_date) {
    const today = todayNumber();
    const start = dayNumber(trip.start_date);
    const end = trip.end_date ? dayNumber(trip.end_date) : start;
    if (today < start) return { phase: 'upcoming', daysUntil: start - today, duration };
    if (today > end) return { phase: 'past', duration };
    return { phase: 'ongoing', duration };
  }
  return { phase: trip.status === 'in_progress' ? 'ongoing' : 'upcoming', duration };
}
