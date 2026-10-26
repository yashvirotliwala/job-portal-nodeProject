const fs = require("fs");
const JobApplication = require("../../models/JobApplicationModel");
const Job = require("../../models/JobModel");
const Resume = require("../../models/ResumeModel");

const VALID_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired"
];

const removeUploadedFile = (filePath) => {
  if (filePath) {
    fs.promises.unlink(filePath).catch(() => {});
  }
};

// Candidate applies with a PDF resume in the same request
const createJobApplication = async (req, res) => {
  let savedResume;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please attach a PDF resume using the 'resume' field"
      });
    }

    // Check the file signature; extension and MIME type alone aren't enough.
    const fileHandle = await fs.promises.open(req.file.path, "r");
    let header;

    try {
      header = Buffer.alloc(5);
      const { bytesRead } = await fileHandle.read(header, 0, 5, 0);

      if (bytesRead !== 5 || header.toString("ascii") !== "%PDF-") {
        removeUploadedFile(req.file.path);

        return res.status(400).json({
          success: false,
          message: "The uploaded file is not a valid PDF"
        });
      }
    } finally {
      await fileHandle.close();
    }

    const { job, coverLetter = "" } = req.body;

    if (!job) {
      removeUploadedFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const jobData = await Job.findById(job);

    if (!jobData) {
      removeUploadedFile(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    if (jobData.status !== "Approved") {
      removeUploadedFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: "You can only apply for approved jobs"
      });
    }

    if (
      jobData.applicationDeadline &&
      new Date(jobData.applicationDeadline) < new Date()
    ) {
      removeUploadedFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: "The application deadline has passed"
      });
    }

    const existingApplication = await JobApplication.findOne({
      job: jobData._id,
      candidate: req.user._id
    });

    if (existingApplication) {
      removeUploadedFile(req.file.path);

      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Save resume metadata for this logged-in candidate.
    savedResume = await Resume.create({
      candidate: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: `uploads/resume/${req.file.filename}`,
      mimeType: "application/pdf",
      size: req.file.size
    });

    // Save the application referencing the new resume.
    const application = await JobApplication.create({
      job: jobData._id,
      candidate: req.user._id,
      resume: savedResume._id,
      coverLetter,
      status: "Applied",
      statusHistory: [
        {
          status: "Applied",
          changedBy: req.user._id,
          note: "Application submitted"
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: {
        application,
        resume: savedResume
      }
    });
  } catch (error) {
    if (savedResume) {
      await Resume.findByIdAndDelete(savedResume._id).catch(() => {});
    }

    removeUploadedFile(req.file?.path);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID"
      });
    }

    console.error("Create application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit job application"
    });
  }
};

// Candidate views only their own applications
const getJobApplication = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      candidate: req.user._id
    })
      .populate("job")
      .populate("resume")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get applications"
    });
  }
};

// Recruiter views applications for their own jobs
const getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id
    }).select("_id");

    const jobIds = jobs.map((item) => item._id);

    const applications = await JobApplication.find({
      job: { $in: jobIds }
    })
      .populate("job")
      .populate("candidate", "name email")
      .populate("resume")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get recruiter applications"
    });
  }
};

// Recruiter updates an application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note = "" } = req.body;

    if (!VALID_STATUSES.includes(status) || status === "Applied") {
      return res.status(400).json({
        success: false,
        message: "Provide a valid status other than Applied"
      });
    }

    const application = await JobApplication.findById(req.params.id)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (
      !application.job ||
      String(application.job.recruiter) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update applications for your own jobs"
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user._id,
      note
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update application status"
    });
  }
};

module.exports = {
  createJobApplication,
  getJobApplication,
  getRecruiterApplications,
  updateApplicationStatus
};