
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

async function createAdmin() {
    try {
        const dbUrl =
            process.env.MODE === "DEVELOPMENT"
                ? process.env.DEV_DB_URL
                : process.env.PRO_DB_URL;

        await mongoose.connect(dbUrl);

        const email = "admin@jobportal.com";
        const password = "Admin@123456";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: "Portal Admin",
            email,
            password: hashedPassword,
            role: "Admin",
            status: "Active"
        });

        console.log("Admin created successfully.");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
