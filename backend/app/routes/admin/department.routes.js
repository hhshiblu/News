const express = require("express");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../controller/admin/department.controller");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listDepartments);
router.post("/", createDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
