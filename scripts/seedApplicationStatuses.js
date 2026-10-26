require("dotenv").config();
const mongoose = require("mongoose");
const ApplicationStatus = require("../models/ApplicationStatus");

const statuses = [
  { name: "Applied", description: "Application submitted" },
  { name: "Under Review", description: "Application is being reviewed" },
  { name: "Shortlisted", description: "Candidate shortlisted" },
  { name: "Rejected", description: "Application rejected" },
  { name: "Hired", description: "Candidate selected" }
];

async function seedStatuses() {
  try {
    const mode = process.env.MODE || "DEVELOPMENT";
    const dbUrl =
      mode === "DEVELOPMENT"
        ? process.env.DEV_DB_URL
        : process.env.PRO_DB_URL;

    if (!dbUrl) {
      throw new Error("Database URL is missing from .env");
    }

    await mongoose.connect(dbUrl);

    for (const status of statuses) {
      await ApplicationStatus.updateOne(
        { name: status.name },
        { $setOnInsert: status },
        { upsert: true }
      );
    }

    console.log("Application statuses seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedStatuses();