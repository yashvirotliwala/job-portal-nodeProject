const express = require("express");

const { protect } = require("../../middleware/auth/authMiddleware");
const { authorizeRoles } = require("../../middleware/role/roleMiddleware");
const { getMyProfile } = require("../../controllers/authTest/authTestController");
const router = express.Router();

// Any logged-in active user
router.get("/me", protect, getMyProfile);

// Admin only
router.get(
    "/admin-only",
    protect,
    authorizeRoles("Admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome, Admin!"
        });
    }
);

// Recruiter or Admin
router.get(
    "/recruiter-only",
    protect,
    authorizeRoles("Recruiter", "Admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Recruiter access granted"
        });
    }
);

// Candidate or Admin
router.get(
    "/candidate-only",
    protect,
    authorizeRoles("Candidate", "Admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Candidate access granted"
        });
    }
);

module.exports = router;

