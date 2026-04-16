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
