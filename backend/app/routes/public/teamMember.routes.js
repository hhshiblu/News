const express = require("express");
const { getPublicTeamMembers } = require("../../controller/public/teamMember.controller");

const router = express.Router();

router.get("/", getPublicTeamMembers);

module.exports = router;
