const ResumeModel = require("../../models/ResumeModel");

// Create Resume
const createResume = async (req, res) => {
    try {
        console.log("resume", req.body);

        const {
            candidateId,
            fileName,
            filePath
        } = req.body;

        if (!candidateId || !fileName || !filePath) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // Create Resume
        const resume = await ResumeModel.create({
            candidateId,
            fileName,
            filePath
        });

        return res.status(201).json({
            status: true,
            message: "Resume created successfully",
            data: resume
        });

    } catch (error) {
        console.log("Error in create resume controller", error);

        return res.status(500).json({
            status: false,
            message: "Failed to create resume",
            error: error.message
        });
    }
};


// Get All Resumes
const getResume = async (req, res) => {
    try {
        const resumes = await ResumeModel.find();

        return res.status(200).json({
            status: true,
            count: resumes.length,
            data: resumes
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to get resumes",
            error: error.message
        });
    }
};


// Get Single Resume
const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await ResumeModel.findById(id);

        if (!resume) {
            return res.status(404).json({
                status: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Resume fetched successfully",
            data: resume
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to get resume",
            error: error.message
        });
    }
};


// Update Resume
const updateResume = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            candidateId,
            fileName,
            filePath
        } = req.body;

        const resume = await ResumeModel.findByIdAndUpdate(
            id,
            {
                candidateId,
                fileName,
                filePath
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                status: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Resume updated successfully",
            data: resume
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to update resume",
            error: error.message
        });
    }
};


// Delete Resume
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await ResumeModel.findByIdAndDelete(id);

        if (!resume) {
            return res.status(404).json({
                status: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Resume deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to delete resume",
            error: error.message
        });
    }
};


module.exports = {
    createResume,
    getResume,
    getResumeById,
    updateResume,
    deleteResume
};
