const express = require("express");

const {
    createResume,
    getResume,
    getResumeById,
    updateResume,
    deleteResume
} = require("../../controllers/resume/resumeController");

const router = express.Router();

// Create Resume
router.post("/", createResume);

// Get All Resumes
router.get("/", getResume);

// Get Single Resume
router.get("/:id", getResumeById);

// Update Resume
router.put("/:id", updateResume);

// Delete Resume
router.delete("/:id", deleteResume);

module.exports = router;
