import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import BestListings from "./components/BestListings";
import PopularSpots from "./components/PopularSpots";
import Articles from "./components/Articles";
import FinestServices from "./components/FinestServices";
import HowItWorks from "./components/HowItWorks";
import FeatureProject from "./components/FeatureProject";
import { getLocations } from "@/lib/api/locations";


export default async function Home() {
  const locationsPage = await getLocations({ isFeature: true, pageSize: 5 });

  return (
    <main className="flex-1">
      <Hero />
      <BestListings />
      <HowItWorks />
      <PopularSpots spots={locationsPage.items} />
      <FeatureProject />
      <Articles />
      <FinestServices />
      <FAQ />
    </main>
  );
}
