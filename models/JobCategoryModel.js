const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String,
      required:true,
      default: ""
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required:true,
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "JobCategory",
  jobCategorySchema
);