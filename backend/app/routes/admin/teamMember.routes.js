const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  listTeamMembersAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../../controller/admin/teamMember.controller");
const { uploadTeamImage } = require("../../middlewares/entityImageUpload.middleware");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listTeamMembersAdmin);
router.post("/", uploadTeamImage.single("image"), createTeamMember);
router.patch("/:id", uploadTeamImage.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;
