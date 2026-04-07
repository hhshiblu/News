/**
 * Whitelisted ad placements — width/height are defaults; each creative can override in DB.
 * Keep keys stable: referenced in site templates and stored on Advertisement.slotKey.
 */
const AD_SLOT_PRESETS = [
  {
    key: "home_top_leaderboard",
    label: "Home — full-width header block",
    defaultWidth: 1200,
    defaultHeight: 120,
  },
  {
    key: "public_sidebar_medium",
    label: "Global sidebar — medium rectangle",
    defaultWidth: 300,
    defaultHeight: 250,
  },
  {
    key: "category_hub_leaderboard",
    label: "Parent category hub",
    defaultWidth: 728,
    defaultHeight: 90,
  },
  {
    key: "child_category_leaderboard",
    label: "Subcategory (child) page",
    defaultWidth: 728,
    defaultHeight: 90,
  },
  {
    key: "article_in_feed",
    label: "Article — in-feed",
    defaultWidth: 728,
    defaultHeight: 90,
  },
  {
    key: "author_page_leaderboard",
    label: "Author profile",
    defaultWidth: 728,
    defaultHeight: 90,
  },
  {
    key: "category_grid_inline",
    label: "Category grid — inline",
    defaultWidth: 728,
    defaultHeight: 90,
  },
];

const SLOT_KEYS = new Set(AD_SLOT_PRESETS.map((s) => s.key));

function isValidSlotKey(key) {
  return typeof key === "string" && SLOT_KEYS.has(key);
}

module.exports = { AD_SLOT_PRESETS, SLOT_KEYS, isValidSlotKey };
