const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  listTeamMembersAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../../controller/admin/teamMember.controller");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listTeamMembersAdmin);
router.post("/", createTeamMember);
router.patch("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;
