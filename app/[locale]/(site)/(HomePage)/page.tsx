import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import BestListings from "./components/BestListings";
import PopularSpots from "./components/PopularSpots";
import Articles from "./components/Articles";
import FinestServices from "./components/FinestServices";
import HowItWorks from "./components/HowItWorks";
import FeatureProject from "./components/FeatureProject";


export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <BestListings />
      <HowItWorks />
      <PopularSpots />
      <FeatureProject />
      <Articles />
      <FinestServices />
      <FAQ />
    </main>
  );
}
