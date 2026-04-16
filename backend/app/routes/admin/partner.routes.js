const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  listPartnersAdmin,
  createPartner,
  updatePartner,
  deletePartner,
} = require("../../controller/admin/partner.controller");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listPartnersAdmin);
router.post("/", createPartner);
router.patch("/:id", updatePartner);
router.delete("/:id", deletePartner);

module.exports = router;
