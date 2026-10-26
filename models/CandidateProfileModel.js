const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    skills: {
      type: [String],
      required:true,
      default: []
    },

    experience: {
      type: String,
      required:true,
      default: ""
    },

    education: {
      type: String,
      required:true,
      default: ""
    },

    professionalInformation: {
      type: String,
      required:true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);