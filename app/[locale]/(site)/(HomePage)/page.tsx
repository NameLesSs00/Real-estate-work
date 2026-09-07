import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import BestListings from "./components/BestListings";
import PopularSpots from "./components/PopularSpots";
import Articles from "./components/Articles";
import FinestServices from "./components/FinestServices";
import HowItWorks from "./components/HowItWorks";
import FeatureProject from "./components/FeatureProject";
import { getLocations, type Location } from "@/lib/api/locations";

function getHomepageOrderRank(location: Location) {
  const order = location.displayOrder ?? 0;
  return order > 0 ? order : Number.MAX_SAFE_INTEGER;
}

function sortLocationsForHomepage(locations: Location[]) {
  return [...locations].sort((a, b) => (
    getHomepageOrderRank(a) - getHomepageOrderRank(b) ||
    new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime() ||
    a.id - b.id
  ));
}

export default async function Home() {
  const locationsPage = await getLocations({ isFeature: true, pageSize: 5 });
  const homepageLocations = sortLocationsForHomepage(locationsPage.items).slice(0, 5);

  return (
    <main className="flex-1">
      <Hero />
      <BestListings />
      <HowItWorks />
      <PopularSpots spots={homepageLocations} />
      <FeatureProject />
      <Articles />
      <FinestServices />
      <FAQ />
    </main>
  );
}
