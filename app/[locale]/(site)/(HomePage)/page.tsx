import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import Categories from "./components/Categories";
import ExploreUnits from "./components/ExploreUnits";
import PopularSpots from "./components/PopularSpots";
import Articles from "./components/Articles";
import WhoWeAre from "./components/WhoWeAre";
import HowItWorks from "./components/HowItWorks";
import FeatureProject from "./components/FeatureProject";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Categories />
      <ExploreUnits />
      <PopularSpots />
      <Articles />
      <WhoWeAre />
      <HowItWorks />
      <FeatureProject />
      <FAQ />
    </main>
  );
}
