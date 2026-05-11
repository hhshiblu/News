import { ARTICLES, REPORTERS, CATEGORIES, BREAKING_NEWS, MARKET_DATA, PHOTO_STORIES } from "./db";

// Helper to populate reporter and category for an article
function populateArticle(article) {
  if (!article) return null;
  const reporter = REPORTERS.find((a) => a.id === article.reporter_id);
  const category = CATEGORIES.find((c) => c.slug === article.category_slug);
  
  return {
    ...article,
    reporter: reporter ? reporter.name : "Unknown",
    reporterData: reporter,
    category: category ? category.label : "General",
    categoryClass: category ? `cat-${category.slug}` : "",
    timestamp: article.publishedAt
  };
}

export function getArticleBySlug(slug) {
  const article = ARTICLES.find((a) => a.slug === slug);
  return populateArticle(article);
}

export function getAllArticles() {
  return ARTICLES.map(populateArticle);
}

export function getFeaturedArticles(limit = null) {
  let featured = ARTICLES.filter((a) => a.featured).map(populateArticle);
  if (limit) featured = featured.slice(0, limit);
  // Shift the first one assuming it's the hero
  return featured.slice(1);
}

export function getHeroArticle() {
  const hero = ARTICLES.find((a) => a.featured);
  return populateArticle(hero);
}

export function getArticlesByCategory(categorySlug, limit = null) {
  let filtered = ARTICLES.filter((a) => a.category_slug === categorySlug).map(populateArticle);
  if (limit) filtered = filtered.slice(0, limit);
  return filtered;
}

export function getOpinionArticles(limit = null) {
  let opinions = ARTICLES.filter((a) => a.isOpinion).map(populateArticle);
  if (limit) opinions = opinions.slice(0, limit);
  return opinions;
}

export function getVideoArticles(limit = null) {
  let videos = ARTICLES.filter((a) => a.isVideo).map(populateArticle);
  if (limit) videos = videos.slice(0, limit);
  return videos;
}

export function getRelatedArticles(currentSlug, categorySlug, limit = 4) {
  const related = ARTICLES
    .filter((a) => a.category_slug === categorySlug && a.slug !== currentSlug)
    .map(populateArticle)
    .slice(0, limit);
  return related;
}

export function getTrendingArticles(limit = 5) {
  // In a real app we'd sort by views, here we just return some latest
  return ARTICLES.slice(0, limit).map(populateArticle);
}

export function getLatestArticles(limit = 5) {
  return ARTICLES.slice().reverse().slice(0, limit).map(populateArticle);
}

export function getBreakingNews() {
  return BREAKING_NEWS;
}

export function getMarketData() {
  return MARKET_DATA;
}

export function getPhotoStories() {
  return PHOTO_STORIES;
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getReporterById(id) {
  return REPORTERS.find(a => a.id === id);
}

export function getArticlesByReporter(reporterId) {
  return ARTICLES.filter(a => a.reporter_id === reporterId).map(populateArticle);
}

export function searchArticles(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return ARTICLES.filter((a) => {
    return (
      a.title.toLowerCase().includes(q) ||
      (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }).map(populateArticle);
}

export function getArticlesByTag(tagSlug) {
  if (!tagSlug) return [];
  const target = tagSlug.replace(/-/g, " ").toLowerCase();
  return ARTICLES.filter(a => 
    a.tags?.some(t => t.toLowerCase() === target)
  ).map(populateArticle);
}

export function getAllTags() {
  const tagCounts = {};
  ARTICLES.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => {
        const normalized = tag.toLowerCase();
        tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
      });
    }
  });

  return Object.keys(tagCounts).map(slug => ({
    name: slug.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug: slug.replace(/\s+/g, '-'),
    count: tagCounts[slug]
  })).sort((a, b) => a.name.localeCompare(b.name));
}
