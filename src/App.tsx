import { LandingPage, CarLabPage } from '@/components/pages';

export default function App() {
  if (window.location.pathname === '/car-lab') return <CarLabPage />;
  return <LandingPage />;
}
