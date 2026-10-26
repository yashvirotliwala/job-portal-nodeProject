const express = require("express");

const userRoutes = require("../routes/users/userRoutes");
const companyRoutes = require("../routes/company/companyRoutes")
const candidateRoutes = require("../routes/candidate/candidateRoutes")
const jobCategoryRoutes = require("../routes/jobCategory/jobCategoryRoutes")
const jobRoutes = require("../routes/job/jobRoutes")
const jobApplicationRoutes = require("../routes/jobApplication/jobApplicationRoutes")
const resumeRoutes = require("../routes/resume/resumeRoutes")
const authRoutes = require("../routes/auth/authRoutes");
const protectedRoutes = require("../routes/protected/protectedRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/company", companyRoutes);
router.use("/candidate", candidateRoutes);
router.use("/   ", jobCategoryRoutes);
router.use("/Job", jobRoutes);
router.use("/JobApplication", jobApplicationRoutes);
router.use("/Resume", resumeRoutes);
router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);

module.exports = router;

router.get("/", (req, res) => {
    res.send("Job Portal API is working");
});

module.exports = router;