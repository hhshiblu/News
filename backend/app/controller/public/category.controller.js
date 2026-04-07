const categoryService = require('../../services/category.service');

const getCategoryTree = async (req, res, next) => {
    try {
        const tree = await categoryService.getCategoryTreeService();
        res.status(200).json({ success: true, data: tree });
    } catch (error) {
        next(error);
    }
};

const getSingleCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await categoryService.getCategoryBySlugService(slug);
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        if(error.message === "Category Not Found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
}

module.exports = { getCategoryTree, getSingleCategory };
