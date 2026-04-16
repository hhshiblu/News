const express = require("express");
const { getPublicPartners } = require("../../controller/public/partner.controller");

const router = express.Router();

router.get("/", getPublicPartners);

module.exports = router;
