import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import Categories from "./components/Categories";
import ExploreUnits from "./components/ExploreUnits";
import PopularSpots from "./components/PopularSpots";
import Articles from "./components/Articles";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Categories />
      <ExploreUnits />
      <PopularSpots />
      <Articles />
      <FAQ />
    </main>
  );
}
