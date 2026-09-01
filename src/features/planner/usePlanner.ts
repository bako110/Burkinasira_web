import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTripDayItem } from '../trips/api/trips.api';
import type { TripDayItem, TripDetail } from '../trips/types';

/**
 * Ajoute un élément (hôtel, resto, guide, transport, activité…) au voyage.
 * Choisit automatiquement le jour cible :
 *  - le jour explicitement demandé s'il existe déjà ;
 *  - sinon la date de début du voyage ;
 *  - sinon aujourd'hui.
 * Le backend crée le jour s'il n'existe pas encore.
 */
export function useAddResourceToTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { item: TripDayItem; date?: string }) => {
      const trip = queryClient.getQueryData<TripDetail>(['trip', tripId]);
      const targetDate =
        args.date ??
        trip?.days[0]?.date ??
        trip?.start_date ??
        new Date().toISOString().slice(0, 10);
      return addTripDayItem(tripId, { date: targetDate, item: args.item });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['trip', tripId], data);
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
    },
  });
}
