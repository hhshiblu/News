const categoryQueries = require('../db_query/category.query');

// Build Tree Memory function for O(n) rendering
const buildTree = (items, parentId = null) => {
    return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
            ...item,
            children: buildTree(items, item.id)
        }));
};

const createCategoryService = async ({ name, slug, imageUrl, parentId }) => {
    // Basic formatting or deeper logic can sit here
    const categoryData = { name, slug, imageUrl };
    if (parentId) categoryData.parentId = parentId;

    return await categoryQueries.creatCategoryQuery(categoryData);
};

const updateCategoryService = async (id, data) => {
    return await categoryQueries.updateCategoryQuery(id, data);
};

const deleteCategoryService = async (id) => {
    return await categoryQueries.deleteCategoryQuery(id);
};

const getCategoryTreeService = async () => {
    const flatCategories = await categoryQueries.getCategoryTreeQuery();
    return buildTree(flatCategories); // Transforms flat array into nested object `{ children: [] }` structure
};

const getCategoryBySlugService = async (slug) => {
    const category = await categoryQueries.getCategoryBySlugQuery(slug);
    if (!category) throw new Error("Category Not Found");
    return category;
}

module.exports = {
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
    getCategoryTreeService,
    getCategoryBySlugService
};
