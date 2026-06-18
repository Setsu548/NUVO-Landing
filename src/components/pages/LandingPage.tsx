import {
  Hero,
  PassengerSection,
  DriverSection,
  FleetSection,
  AppDownloadCTA,
  SupportBanner,
} from '@/components/organisms';
import { LandingLayout } from '@/components/templates';

export function LandingPage() {
  return (
    <LandingLayout>
      <Hero />
      <PassengerSection />
      <DriverSection />
      <FleetSection />
      <AppDownloadCTA />
      <SupportBanner />
    </LandingLayout>
  );
}
