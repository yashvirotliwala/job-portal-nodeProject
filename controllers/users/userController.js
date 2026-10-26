const User = require("../../models/userModel");

// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
};


// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: error.message
        });
    }
};


// Get Single User
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user",
            error: error.message
        });
    }
};


// Update User
const updateUser = async (req, res) => {
    try {
        const { name, email, role, status } = req.body;

        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            {
                name,
                email,
                role,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
};


// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            id: req.params.id
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};


module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};