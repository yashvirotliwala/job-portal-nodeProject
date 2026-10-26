
const express = require("express");
const router = express.Router();

const {
    protect
} = require("../../middleware/auth/authMiddleware");

const {
    authorizeRoles
} = require("../../middleware/role/roleMiddleware");

const {
    createJob,
    getJob,
    getJobById,
    updateJob,
    deleteJob
} = require("../../controllers/job/jobController");

const {
    submitJob,
    getPendingJobs,
    approveJob,
    rejectJob,
    editRejectedJob,
    resubmitJob,
    getApprovedJobs
} = require("../../controllers/job/jobApprovalController");


// =====================================
// CANDIDATE
// =====================================

router.get(
    "/approved",
    protect,
    authorizeRoles("Candidate"),
    getApprovedJobs
);


// =====================================
// ADMIN
// =====================================

router.get(
    "/pending",
    protect,
    authorizeRoles("Admin"),
    getPendingJobs
);

router.patch(
    "/:id/approve",
    protect,
    authorizeRoles("Admin"),
    approveJob
);

router.patch(
    "/:id/reject",
    protect,
    authorizeRoles("Admin"),
    rejectJob
);


// =====================================
// RECRUITER
// =====================================

// Create Draft job
router.post(
    "/",
    protect,
    authorizeRoles("Recruiter"),
    createJob
);

// View/manage jobs
router.get(
    "/manage",
    protect,
    authorizeRoles("Recruiter", "Admin"),
    getJob
);

// Submit Draft job
router.patch(
    "/:id/submit",
    protect,
    authorizeRoles("Recruiter"),
    submitJob
);

// Edit Rejected job
router.patch(
    "/:id/edit-rejected",
    protect,
    authorizeRoles("Recruiter"),
    editRejectedJob
);

// Resubmit Rejected job
router.patch(
    "/:id/resubmit",
    protect,
    authorizeRoles("Recruiter"),
    submitJob
);

// Update Draft job
router.put(
    "/:id",
    protect,
    authorizeRoles("Recruiter"),
    updateJob
);

// Delete Draft or Rejected job
router.delete(
    "/:id",
    protect,
    authorizeRoles("Recruiter"),
    deleteJob
);


// =====================================
// JOB DETAILS
// =====================================

router.get(
    "/:id",
    protect,
    getJobById
);


module.exports = router;
