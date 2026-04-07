const express = require('express');
const { getCategoryTree, getSingleCategory } = require('../../controller/public/category.controller');

const router = express.Router();

router.get('/', getCategoryTree);
router.get('/:slug', getSingleCategory);

module.exports = router;
