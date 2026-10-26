const jobCatagoryModel = require("../../models/JobCategoryModel");

// Create jobcategory
const createJobCategory = async (req, res) => {
    try {
        console.log("controller", req.body);

        const {
            name,
            description,
            status
        } = req.body;

        console.log(req.body);

        if (!name || !description || !status) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // Check if company already exists
        const existingJobCategory = await jobCatagoryModel.findOne({
            name
        });

        if (existingJobCategory) {
            return res.status(400).json({
                status: false,
                message: "name already registered"
            });
        }

        // Create jobcategory
        const JobCategory = await jobCatagoryModel.create({
            name,
            description,
            status
        });

        res.status(201).json({
            status: true,
            message: "jobCategory created successfully",
            data: JobCategory
        });

    } catch (error) {
        console.log("Error in create company controller", error);

        res.status(500).json({
            status: false,
            message: "Failed to create company",
            data: error
        });
    }
};


// Get All Companies
const getJobCategory = async (req, res) => {
    try {

        const JobCategories = await jobCatagoryModel.find();

        res.status(200).json({
            status: true,
            count: JobCategories.length,
            data: JobCategories
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get JobCategories",
            data: error
        });
    }
};


// Get Single Company
const getJobCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const JobCategory = await jobCatagoryModel.findById(id);

        if (!JobCategory) {
            return res.status(404).json({
                status: false,
                message: "JobCategory not found"
            });
        }

        console.log(JobCategory)

        res.status(200).json({
            status: true,
            message: "fetch Sucessfull",
            data: JobCategory
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get company",
            data: error
        });
    }
};


// Update Company
const updateJobCategory = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name,
            description,
            status
        } = req.body;

        const JobCategory = await jobCatagoryModel.findByIdAndUpdate(id,
            {
                name,
                description,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!JobCategory) {
            return res.status(404).json({
                status: false,
                message: "JobCategory not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "JobCategory updated successfully",
            data: JobCategory
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to update jobcategory",
            data:error
        });
    }
};


// Delete Company
const deleteJobCategory = async (req, res) => {
    try {
        const { id } = req.params
        const JobCategory = await jobCatagoryModel.findOneAndDelete(id);

        if (!JobCategory) {
            return res.status(404).json({
                status: false,
                message: "JobCategory not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "JobCategory deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to delete JobCategory",
            data:error
        });
    }
};


module.exports = {
    createJobCategory,
    getJobCategory,
    getJobCategoryById,
    updateJobCategory,
    deleteJobCategory
};