
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Contract",
        "Remote"
      ],
      required: true
    },

    salaryMin: {
      type: Number,
      required: true,
      min: 0
    },

    salaryMax: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.salaryMin;
        },
        message: "Maximum salary must be greater than or equal to minimum salary"
      }
    },

    requiredSkills: {
      type: [String],
      required: true,
      default: []
    },

    experienceLevel: {
      type: String,
      enum: [
        "Fresher",
        "Entry Level",
        "Mid Level",
        "Senior Level"
      ],
      required: true
    },

    applicationDeadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["Draft", "Pending", "Approved", "Rejected"],
      default: "Draft",
      required:true
    },

    rejectionReason: {
      type: String,
      default: ""
    },

    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);
