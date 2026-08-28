import { useTranslation } from 'react-i18next';

import { ListingHero } from '../../../shared/ui/ListingHero';

interface ExploreHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function ExploreHero({ query, onQueryChange, onSubmit }: ExploreHeroProps) {
  const { t } = useTranslation();

  return (
    <ListingHero
      title={t('destinations.title')}
      subtitle={t('explore.subtitle')}
      searchPlaceholder={t('home.searchPlaceholder')}
      searchLabel={t('common.search')}
      searchButtonLabel={t('common.search')}
      query={query}
      onQueryChange={onQueryChange}
      onSubmit={onSubmit}
    />
  );
}
