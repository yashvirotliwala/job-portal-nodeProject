const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    companyName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    industry: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    // companyImage: {
    //   type: String
    // }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Company", companySchema);