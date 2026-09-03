import { useTranslation } from 'react-i18next';

import { ITINERARIES } from './itineraries.data';
import { ITINERARIES_EN } from './itineraries.data.en';
import type { Itinerary } from './types';

/**
 * Le contenu editorial des itineraires vit dans itineraries.data.ts (francais,
 * source de verite) et itineraries.data.en.ts (anglais). Le moore et le dioula
 * retombent sur le francais tant qu'un traducteur ne les a pas fournis.
 *
 * Seuls les champs textuels sont traduits ; les valeurs structurelles (slug,
 * region, budgetFrom, coverTheme, durationDays, pace, time, type,
 * destinationSlug, estimatedCost) restent celles de la version francaise.
 */
type Lang = 'fr' | 'en' | 'mo' | 'dyu';

function pickBySlug(list: Itinerary[], slug: string): Itinerary | undefined {
  return list.find((it) => it.slug === slug);
}

function mergeStops(base: Itinerary['days'][number]['stops'], loc?: Itinerary['days'][number]['stops']) {
  return base.map((stop, i) => {
    const l = loc?.[i];
    if (!l) return stop;
    return {
      ...stop,
      title: l.title ?? stop.title,
      description: l.description ?? stop.description,
      tip: l.tip ?? stop.tip,
    };
  });
}

function mergeItinerary(base: Itinerary, loc?: Itinerary): Itinerary {
  if (!loc) return base;
  return {
    ...base,
    title: loc.title ?? base.title,
    tagline: loc.tagline ?? base.tagline,
    intro: loc.intro ?? base.intro,
    audience: loc.audience?.length ? loc.audience : base.audience,
    bestSeason: loc.bestSeason ?? base.bestSeason,
    highlights: loc.highlights?.length ? loc.highlights : base.highlights,
    notIncluded: loc.notIncluded?.length ? loc.notIncluded : base.notIncluded,
    days: base.days.map((day, di) => {
      const ld = loc.days?.[di];
      return {
        ...day,
        title: ld?.title ?? day.title,
        summary: ld?.summary ?? day.summary,
        stops: mergeStops(day.stops, ld?.stops),
      };
    }),
  };
}

function localizedList(lang: Lang): Itinerary[] {
  if (lang === 'en') {
    return ITINERARIES.map((base) => mergeItinerary(base, pickBySlug(ITINERARIES_EN, base.slug)));
  }
  // fr, mo, dyu -> francais (mo/dyu en attente de traduction humaine)
  return ITINERARIES;
}

function currentLang(raw: string): Lang {
  const l = raw.split('-')[0];
  return l === 'en' || l === 'mo' || l === 'dyu' ? (l as Lang) : 'fr';
}

/** Liste des itineraires dans la langue active. */
export function useLocalizedItineraries(): Itinerary[] {
  const { i18n } = useTranslation();
  return localizedList(currentLang(i18n.language));
}

/** Un itineraire par slug, dans la langue active. */
export function useLocalizedItinerary(slug: string | undefined): Itinerary | undefined {
  const { i18n } = useTranslation();
  if (!slug) return undefined;
  return localizedList(currentLang(i18n.language)).find((it) => it.slug === slug);
}
