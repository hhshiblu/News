const prisma = require('./prisma');

const creatCategoryQuery = async (data) => {
    return prisma.category.create({ data });
};

const updateCategoryQuery = async (id, data) => {
    return prisma.category.update({
        where: { id },
        data
    });
};

const deleteCategoryQuery = async (id) => {
    return prisma.category.delete({
        where: { id }
    });
};

const getCategoryTreeQuery = async () => {
    // Specifically fetch root categories, Prisma will recursively include children based on deep selection if needed.
    // For arbitrary depth, we can query flat and build tree in memory, or query nested.
    // Let's query flat and build tree in service for infinite depth.
    return prisma.category.findMany();
};

const getCategoryBySlugQuery = async (slug) => {
    return prisma.category.findUnique({
        where: { slug }
    });
}

module.exports = {
    creatCategoryQuery,
    updateCategoryQuery,
    deleteCategoryQuery,
    getCategoryTreeQuery,
    getCategoryBySlugQuery
};
