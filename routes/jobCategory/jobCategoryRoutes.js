const express = require("express");

const {
    createJobCategory,
    getJobCategory,
    getJobCategoryById,
    updateJobCategory,
    deleteJobCategory
} = require("../../controllers/jobCategory/jobCategoryController");

const router = express.Router();

router.post("/", createJobCategory);


// @/api/company/
router.get("/", getJobCategory);

router.get("/:id", getJobCategoryById);

router.put("/:id", updateJobCategory);

router.delete("/:id", deleteJobCategory);

module.exports = router;