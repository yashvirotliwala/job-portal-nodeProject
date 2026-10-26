
const jobModel = require("../../models/JobModel");

// =====================================
// 1. CREATE JOB
// =====================================
const createJob = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                status: false,
                message: "Please log in first"
            });
        }

        const {
            company,
            category,
            title,
            description,
            location,
            employmentType,
            salaryMin,
            salaryMax,
            requiredSkills,
            experienceLevel,
            applicationDeadline
        } = req.body;

        if (
            !company ||
            !category ||
            !title ||
            !description ||
            !location ||
            !employmentType ||
            salaryMin === undefined ||
            salaryMax === undefined ||
            !Array.isArray(requiredSkills) ||
            requiredSkills.length === 0 ||
            !experienceLevel ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                status: false,
                message: "All required fields must be provided"
            });
        }

        const minSalary = Number(salaryMin);
        const maxSalary = Number(salaryMax);
        const deadline = new Date(applicationDeadline);

        if (
            !Number.isFinite(minSalary) ||
            !Number.isFinite(maxSalary) ||
            minSalary < 0 ||
            maxSalary < minSalary
        ) {
            return res.status(400).json({
                status: false,
                message: "Please enter valid salary values"
            });
        }

        if (
            Number.isNaN(deadline.getTime()) ||
            deadline <= new Date()
        ) {
            return res.status(400).json({
                status: false,
                message: "Application deadline must be in the future"
            });
        }

        const job = await jobModel.create({
            recruiter: req.user._id,
            company,
            category,
            title,
            description,
            location,
            employmentType,
            salaryMin: minSalary,
            salaryMax: maxSalary,
            requiredSkills,
            experienceLevel,
            applicationDeadline: deadline,
            status: "Draft",
            rejectionReason: "",
            approvedAt: null
        });

        return res.status(201).json({
            status: true,
            message: "Job created successfully as Draft",
            data: job
        });

    } catch (error) {
        console.error("Create job error:", error);

        return res.status(400).json({
            status: false,
            message: "Failed to create job",
            error: error.message
        });
    }
};


// =====================================
// 2. GET JOBS FOR RECRUITER / ADMIN
// =====================================
const getJob = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "Recruiter") {
            filter.recruiter = req.user._id;
        } else if (req.user.role !== "Admin") {
            return res.status(403).json({
                status: false,
                message: "You are not authorized to view these jobs"
            });
        }

        const jobs = await jobModel
            .find(filter)
            .populate("company")
            .populate("category")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        console.error("Get jobs error:", error);

        return res.status(500).json({
            status: false,
            message: "Failed to get jobs",
            error: error.message
        });
    }
};


// =====================================
// 3. GET SINGLE JOB
// =====================================
const getJobById = async (req, res) => {
    try {
        const job = await jobModel
            .findById(req.params.id)
            .populate("company")
            .populate("category");

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found"
            });
        }

        const isAdmin = req.user.role === "Admin";

        const isOwner =
            req.user.role === "Recruiter" &&
            job.recruiter &&
            job.recruiter.toString() === req.user._id.toString();

        const isCandidate = req.user.role === "Candidate";
        const isApproved = job.status === "Approved";

        if (
            !isAdmin &&
            !isOwner &&
            !(isCandidate && isApproved)
        ) {
            return res.status(403).json({
                status: false,
                message: "You cannot view this job"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Job fetched successfully",
            data: job
        });

    } catch (error) {
        console.error("Get job by ID error:", error);

        return res.status(400).json({
            status: false,
            message: "Failed to get job",
            error: error.message
        });
    }
};


// =====================================
// 4. UPDATE DRAFT JOB
// =====================================
const updateJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found"
            });
        }

        if (
            !job.recruiter ||
            job.recruiter.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                status: false,
                message: "You can update only your own jobs"
            });
        }

        if (job.status !== "Draft") {
            return res.status(400).json({
                status: false,
                message: "Only Draft jobs can be updated here"
            });
        }

        const allowedFields = [
            "company",
            "category",
            "title",
            "description",
            "location",
            "employmentType",
            "salaryMin",
            "salaryMax",
            "requiredSkills",
            "experienceLevel",
            "applicationDeadline"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        }

        if (
            !Number.isFinite(Number(job.salaryMin)) ||
            !Number.isFinite(Number(job.salaryMax)) ||
            Number(job.salaryMin) < 0 ||
            Number(job.salaryMax) < Number(job.salaryMin)
        ) {
            return res.status(400).json({
                status: false,
                message: "Please enter valid salary values"
            });
        }

        if (
            !job.applicationDeadline ||
            new Date(job.applicationDeadline) <= new Date()
        ) {
            return res.status(400).json({
                status: false,
                message: "Application deadline must be in the future"
            });
        }

        await job.save();

        return res.status(200).json({
            status: true,
            message: "Draft job updated successfully",
            data: job
        });

    } catch (error) {
        console.error("Update job error:", error);

        return res.status(400).json({
            status: false,
            message: "Failed to update job",
            error: error.message
        });
    }
};


// =====================================
// 5. DELETE JOB
// =====================================
const deleteJob = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found"
            });
        }

        if (
            !job.recruiter ||
            job.recruiter.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                status: false,
                message: "You can delete only your own jobs"
            });
        }

        if (!["Draft", "Rejected"].includes(job.status)) {
            return res.status(400).json({
                status: false,
                message: "Only Draft or Rejected jobs can be deleted"
            });
        }

        await jobModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            status: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        return res.status(400).json({
            status: false,
            message: "Failed to delete job",
            error: error.message
        });
    }
};


module.exports = {
    createJob,
    getJob,
    getJobById,
    updateJob,
    deleteJob
};
