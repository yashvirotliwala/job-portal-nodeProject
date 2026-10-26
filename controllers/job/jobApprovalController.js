
const Job = require("../../models/JobModel");

// Recruiter submits Draft or corrected Rejected job
const submitJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            recruiter: req.user._id
        });

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found or you do not own this job"
            });
        }

        if (!["Draft", "Rejected"].includes(job.status)) {
            return res.status(400).json({
                status: false,
                message: "Only Draft or Rejected jobs can be submitted"
            });
        }

        if (new Date(job.applicationDeadline) <= new Date()) {
            return res.status(400).json({
                status: false,
                message: "Application deadline must be in the future"
            });
        }

        job.status = "Pending";
        job.rejectionReason = "";
        job.approvedAt = null;

        await job.save();

        return res.status(200).json({
            status: true,
            message: "Job submitted for Admin approval",
            data: job
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to submit job",
            error: error.message
        });
    }
};


// Admin views all Pending jobs
const getPendingJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: "Pending" })
            .populate("recruiter", "name email")
            .populate("company")
            .populate("category")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch pending jobs",
            error: error.message
        });
    }
};


// Admin approves a Pending job
const approveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found"
            });
        }

        if (job.status !== "Pending") {
            return res.status(400).json({
                status: false,
                message: "Only Pending jobs can be approved"
            });
        }

        job.status = "Approved";
        job.rejectionReason = "";
        job.approvedAt = new Date();

        await job.save();

        return res.status(200).json({
            status: true,
            message: "Job approved successfully",
            data: job
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to approve job",
            error: error.message
        });
    }
};


// Admin rejects a Pending job with a reason
const rejectJob = async (req, res) => {
    try {
        const reason = String(
            req.body.rejectionReason || ""
        ).trim();

        if (!reason) {
            return res.status(400).json({
                status: false,
                message: "Rejection reason is required"
            });
        }

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found"
            });
        }

        if (job.status !== "Pending") {
            return res.status(400).json({
                status: false,
                message: "Only Pending jobs can be rejected"
            });
        }

        job.status = "Rejected";
        job.rejectionReason = reason;
        job.approvedAt = null;

        await job.save();

        return res.status(200).json({
            status: true,
            message: "Job rejected successfully",
            data: job
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to reject job",
            error: error.message
        });
    }
};


// Recruiter edits a Rejected job
const editRejectedJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            recruiter: req.user._id
        });

        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found or you do not own this job"
            });
        }

        if (job.status !== "Rejected") {
            return res.status(400).json({
                status: false,
                message: "Only Rejected jobs can be edited here"
            });
        }

        // Only allow editable job fields.
        // Never accept status or recruiter from req.body.
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

        await job.save();

        return res.status(200).json({
            status: true,
            message: "Rejected job updated. Submit it again for approval.",
            data: job
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to edit rejected job",
            error: error.message
        });
    }
};


// Candidates can see only Approved jobs
const getApprovedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: "Approved",
            applicationDeadline: { $gte: new Date() }
        })
            .populate("company")
            .populate("category")
            .sort({ approvedAt: -1 });

        return res.status(200).json({
            status: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch approved jobs",
            error: error.message
        });
    }
};

module.exports = {
    submitJob,
    getPendingJobs,
    approveJob,
    rejectJob,
    editRejectedJob,
    getApprovedJobs
};
