import SectionHeader from "@/components/sections/SectionHeader";
import MarketTicker from "@/components/sections/MarketTicker";
import MarketSnapshot from "@/components/sections/MarketSnapshot";
import MediumCard from "@/components/news/MediumCard";
import HorizontalCard from "@/components/news/HorizontalCard";

export default function EconomySection({ posts = [] }) {
  if (!posts.length) return null;

  const mediumCards = posts.slice(0, 3);
  const horizontalCards = posts.slice(3, 5);

  return (
    <section className="section-gap">
      <SectionHeader title="Economy & Markets" href="/economy/finance" emoji="💹" />

      {/* Market Ticker */}
      <MarketTicker />

      {/* 3 Medium Cards + 1 Market Snapshot widget */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {mediumCards.map((story) => (
          <MediumCard key={story.id} story={story} />
        ))}
        <MarketSnapshot />
      </div>

      {/* 2 Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {horizontalCards.map((story) => (
          <HorizontalCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
