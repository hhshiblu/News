/** Mirror of backend/app/constants/adSlots.js for dashboard UI. */
export const AD_SLOT_PRESETS = [
  { key: "home_top_leaderboard", label: "Home — full-width header block", defaultWidth: 1200, defaultHeight: 120 },
  { key: "public_sidebar_medium", label: "Global sidebar — medium rectangle", defaultWidth: 300, defaultHeight: 250 },
  { key: "category_hub_leaderboard", label: "Parent category hub", defaultWidth: 728, defaultHeight: 90 },
  { key: "child_category_leaderboard", label: "Subcategory page", defaultWidth: 728, defaultHeight: 90 },
  { key: "article_in_feed", label: "Article — in-feed", defaultWidth: 728, defaultHeight: 90 },
  { key: "author_page_leaderboard", label: "Author profile", defaultWidth: 728, defaultHeight: 90 },
  { key: "category_grid_inline", label: "Category grid — inline", defaultWidth: 728, defaultHeight: 90 },
];

export function presetForKey(key) {
  return AD_SLOT_PRESETS.find((p) => p.key === key);
}
