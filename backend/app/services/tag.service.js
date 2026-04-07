const tagQueries = require('../db_query/tag.query');

const createTagService = async (data) => {
    return await tagQueries.createTagQuery(data);
};

const updateTagService = async (id, data) => {
    return await tagQueries.updateTagQuery(id, data);
};

const deleteTagService = async (id) => {
    return await tagQueries.deleteTagQuery(id);
};

const getAllTagsService = async () => {
    return await tagQueries.getAllTagsQuery();
};

module.exports = {
    createTagService, updateTagService, deleteTagService, getAllTagsService
};
