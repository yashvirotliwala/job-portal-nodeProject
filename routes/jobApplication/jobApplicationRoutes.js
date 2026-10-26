const express = require("express");
const router = express.Router();

const {
  createJobApplication,
  getJobApplication,
  getRecruiterApplications,
  updateApplicationStatus
} = require("../../controllers/jobApplication/jobApplicationController");

const {
  protect
} = require("../../middleware/auth/authMiddleware");

const {
  authorizeRoles
} = require("../../middleware/role/roleMiddleware");

const {
  uploadResume
} = require("../../middleware/resume/resumeUpload");

router.use(protect);

// Candidate submits application and PDF resume together
router.post(
  "/",
  authorizeRoles("Candidate"),
  uploadResume,
  createJobApplication
);

// Candidate sees their own applications
router.get(
  "/my-applications",
  authorizeRoles("Candidate"),
  getJobApplication
);

// Recruiter sees applications for their own jobs
router.get(
  "/recruiter",
  authorizeRoles("Recruiter"),
  getRecruiterApplications
);

// Recruiter updates an application status
router.patch(
  "/:id/status",
  authorizeRoles("Recruiter"),
  updateApplicationStatus
);

module.exports = router;