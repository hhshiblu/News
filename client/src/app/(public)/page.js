import { getNewsFeed, getCategories } from "@/actions/public";

import PulseHero from "@/components/sections/PulseHero";
import BreakingRow from "@/components/sections/BreakingRow";
import IndustryGrid from "@/components/sections/IndustryGrid";
import TrendingBlock from "@/components/sections/TrendingBlock";
import PhotoLounge from "@/components/sections/PhotoLounge";
import MustReadSection from "@/components/sections/MustReadSection";
import CategoryTitlesStrip from "@/components/sections/CategoryTitlesStrip";
import EditorialStrip from "@/components/sections/EditorialStrip";
import NewsletterSection from "@/components/sections/NewsletterSection";
import {
  HomeMagazineDesks,
  HomeTitleCardBand,
  HomeHeadlinesRiver,
} from "@/components/sections/HomeScrollSections";

export const metadata = {
  title: "LabourPulse — Bangladesh's Leading Labour & Economy News",
  description:
    "Comprehensive coverage of labour rights, industrial relations, and economic shifts in Bangladesh and beyond.",
};

const MAIN_DESK_POSTS = 14;
const EXTRA_DESK_POSTS = 8;

export default async function HomePage() {
  const catRes = await getCategories();
  const allCats = catRes.data || [];
  const getCat = (slug) =>
    allCats.find((c) => c.slug === slug) || {
      id: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
    };

  const [
    featuredRes,
    latestRes,
    breakingRes,
    trendingRes,
    politicsRes,
    economyRes,
    labourRes,
    intlRes,
    healthRes,
    businessRes,
    techRes,
    opinionRes,
    photoRes,
  ] = await Promise.all([
    getNewsFeed({ featured: true, limit: 6 }),
    getNewsFeed({ limit: 36 }),
    getNewsFeed({ limit: 8 }),
    getNewsFeed({ limit: 12 }),
    getNewsFeed({ categoryId: getCat("politics").id, limit: MAIN_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("economy").id, limit: MAIN_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("labour").id, limit: MAIN_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("international").id, limit: MAIN_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("health").id, limit: EXTRA_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("business").id, limit: EXTRA_DESK_POSTS }),
    getNewsFeed({ categoryId: getCat("technology").id, limit: EXTRA_DESK_POSTS }),
    getNewsFeed({ isOpinion: true, limit: 5 }),
    getNewsFeed({ isPhotoStory: true, limit: 5 }),
  ]);

  const politics = politicsRes.posts || [];
  const economy = economyRes.posts || [];
  const labour = labourRes.posts || [];
  const intl = intlRes.posts || [];
  const health = healthRes.posts || [];
  const business = businessRes.posts || [];
  const tech = techRes.posts || [];

  const industryCategories = [
    getCat("politics"),
    getCat("economy"),
    getCat("labour"),
    getCat("international"),
  ];
  const industryData = {
    politics: politics.slice(0, 6),
    economy: economy.slice(0, 6),
    labour: labour.slice(0, 6),
    international: intl.slice(0, 6),
  };

  const latest = latestRes.posts || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-0">
        <PulseHero featuredPosts={featuredRes.posts || []} latestPosts={latest} />
      </div>

      <BreakingRow posts={breakingRes.posts || []} />

      <HomeMagazineDesks
        layoutOffset={0}
        desks={[
          { category: getCat("politics"), posts: politics.slice(6, 11) },
          { category: getCat("economy"), posts: economy.slice(6, 11) },
          { category: getCat("labour"), posts: labour.slice(6, 11) },
          { category: getCat("international"), posts: intl.slice(6, 11) },
        ]}
      />

      <HomeTitleCardBand
        items={[
          { category: getCat("politics"), posts: politics.slice(11, 14) },
          { category: getCat("economy"), posts: economy.slice(11, 14) },
          { category: getCat("labour"), posts: labour.slice(11, 14) },
          { category: getCat("international"), posts: intl.slice(11, 14) },
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <IndustryGrid categories={industryCategories} postsByCategory={industryData} />
      </div>

      <TrendingBlock posts={trendingRes.posts || []} sidePosts={latest} />

      <PhotoLounge photoPosts={photoRes.posts || []} />

      <HomeMagazineDesks
        layoutOffset={1}
        desks={[
          { category: getCat("health"), posts: health.slice(0, 5) },
          { category: getCat("business"), posts: business.slice(0, 5) },
          { category: getCat("technology"), posts: tech.slice(0, 5) },
        ]}
      />

      <HomeHeadlinesRiver posts={latest.slice(14, 34)} title="Still reporting" />

      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <MustReadSection posts={opinionRes.posts || latest || []} />
      </div>

      <CategoryTitlesStrip categorySlugs={["politics", "economy", "labour"]} />

      <EditorialStrip posts={latest.slice(24, 27)} />

      <NewsletterSection />
    </div>
  );
}
