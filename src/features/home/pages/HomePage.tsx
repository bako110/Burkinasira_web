import { WelcomeBanner } from '../components/WelcomeBanner';
import { Hero } from '../components/Hero';
import { TrustBand } from '../components/TrustBand';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FeaturedDestinations } from '../components/FeaturedDestinations';
import { StatsBand } from '../components/StatsBand';
import { WhyGoTours } from '../components/WhyGoTours';
import { FinalCta } from '../components/FinalCta';

export function HomePage() {
  return (
    <>
      <WelcomeBanner />
      <Hero />
      <TrustBand />
      <CategoryShowcase />
      <FeaturedDestinations />
      <StatsBand />
      <WhyGoTours />
      <FinalCta />
    </>
  );
}
