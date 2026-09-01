import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { createTrip, addTripDayItem } from '../trips/api/trips.api';
import type { TripDetail } from '../trips/types';
import type { Itinerary } from './types';

/**
 * « Cloner » un itinéraire premium : on crée un vrai voyage (Trip) daté à
 * partir d'aujourd'hui, puis on y ajoute chaque étape jour par jour. Le
 * voyageur poursuit ensuite la personnalisation dans le planificateur.
 */
export function useCloneItinerary() {
  const queryClient = useQueryClient();
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function clone(itinerary: Itinerary, startDate?: string): Promise<TripDetail> {
    setIsCloning(true);
    setError(null);
    try {
      const base = startDate ? new Date(startDate) : new Date();
      const start = new Date(base);
      const end = new Date(base);
      end.setDate(end.getDate() + Math.max(itinerary.durationDays - 1, 0));

      const iso = (d: Date) => d.toISOString().slice(0, 10);

      let trip = await createTrip({
        title: itinerary.title,
        region: itinerary.region,
        themes: ['region'],
        start_date: iso(start),
        end_date: iso(end),
        budget_estimate: itinerary.budgetFrom.standard,
        currency: 'XOF',
      });

      // Ajout séquentiel : chaque appel renvoie le Trip à jour.
      for (let dayIndex = 0; dayIndex < itinerary.days.length; dayIndex += 1) {
        const day = itinerary.days[dayIndex];
        const date = new Date(base);
        date.setDate(date.getDate() + dayIndex);
        const dateStr = iso(date);

        for (const stop of day.stops) {
          trip = await addTripDayItem(trip.id, {
            date: dateStr,
            item: {
              time: stop.time,
              type: stop.type,
              title: stop.title,
              notes: stop.tip ? `${stop.description}\n💡 ${stop.tip}` : stop.description,
              estimated_cost: stop.estimatedCost,
              reference_id: stop.destinationSlug,
            },
          });
        }
      }

      queryClient.setQueryData(['trip', trip.id], trip);
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      return trip;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsCloning(false);
    }
  }

  return { clone, isCloning, error };
}
