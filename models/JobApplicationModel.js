const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true
        },

        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        coverLetter: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Under Review",
                "Shortlisted",
                "Rejected",
                "Hired"
            ],
            default: "Applied",
            required: true
        },

        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "Applied",
                        "Under Review",
                        "Shortlisted",
                        "Rejected",
                        "Hired"
                    ],
                    required: true
                },

                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                changedAt: {
                    type: Date,
                    default: Date.now
                },

                note: {
                    type: String,
                    trim: true,
                    maxlength: 1000,
                    default: ""
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// A candidate can apply only once to the same job.
jobApplicationSchema.index(
    { job: 1, candidate: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);