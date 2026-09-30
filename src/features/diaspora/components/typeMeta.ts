import { Compass, Home, Bus, PartyPopper, LifeBuoy, Landmark, type LucideIcon } from 'lucide-react';

import type { DiasporaContentType } from '../types';

/** Icône et couleur (data-tone dans les CSS) de chaque thème de contenu diaspora. */
export const TYPE_META: Record<DiasporaContentType, { Icon: LucideIcon; tone: string }> = {
  circuit_culturel: { Icon: Compass, tone: 'orange' },
  patrimoine_familial: { Icon: Landmark, tone: 'amber' },
  hebergement: { Icon: Home, tone: 'blue' },
  transport: { Icon: Bus, tone: 'teal' },
  evenement_culturel: { Icon: PartyPopper, tone: 'pink' },
  service_visiteur_retour: { Icon: LifeBuoy, tone: 'green' },
};

export const TYPE_ORDER = Object.keys(TYPE_META) as DiasporaContentType[];
