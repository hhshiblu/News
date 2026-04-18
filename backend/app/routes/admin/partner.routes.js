const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  listPartnersAdmin,
  createPartner,
  updatePartner,
  deletePartner,
} = require("../../controller/admin/partner.controller");
const { uploadPartnerLogo } = require("../../middlewares/entityImageUpload.middleware");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listPartnersAdmin);
router.post("/", uploadPartnerLogo.single("image"), createPartner);
router.patch("/:id", uploadPartnerLogo.single("image"), updatePartner);
router.delete("/:id", deletePartner);

module.exports = router;
