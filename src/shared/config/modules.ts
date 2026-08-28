import {
  BedDouble,
  UtensilsCrossed,
  Bus,
  Compass,
  PartyPopper,
  ScrollText,
  ShoppingBasket,
  Stethoscope,
  ShieldAlert,
  Landmark,
  Wifi,
  Map,
  CloudSun,
  Users,
} from 'lucide-react';

export interface ModuleLink {
  to: string;
  labelKey: string;
  Icon: typeof BedDouble;
}

export const ALL_MODULES: ModuleLink[] = [
  { to: '/explore', labelKey: 'nav.explore', Icon: Map },
  { to: '/hotels', labelKey: 'nav.hotels', Icon: BedDouble },
  { to: '/restaurants', labelKey: 'nav.restaurants', Icon: UtensilsCrossed },
  { to: '/mobility', labelKey: 'nav.mobility', Icon: Bus },
  { to: '/guides', labelKey: 'nav.guides', Icon: Compass },
  { to: '/events', labelKey: 'nav.events', Icon: PartyPopper },
  { to: '/culture', labelKey: 'nav.culture', Icon: ScrollText },
  { to: '/market', labelKey: 'nav.market', Icon: ShoppingBasket },
  { to: '/health', labelKey: 'nav.health', Icon: Stethoscope },
  { to: '/emergency', labelKey: 'nav.emergency', Icon: ShieldAlert },
  { to: '/finance', labelKey: 'nav.finance', Icon: Landmark },
  { to: '/connectivity', labelKey: 'nav.connectivity', Icon: Wifi },
  { to: '/weather', labelKey: 'nav.weather', Icon: CloudSun },
  { to: '/community', labelKey: 'nav.community', Icon: Users },
];

export function getRelatedModules(currentPath: string, count = 4): ModuleLink[] {
  const others = ALL_MODULES.filter((m) => m.to !== currentPath);
  const startIndex = ALL_MODULES.findIndex((m) => m.to === currentPath);
  const offset = startIndex >= 0 ? (startIndex + 1) % others.length : 0;
  return [...others.slice(offset), ...others.slice(0, offset)].slice(0, count);
}
