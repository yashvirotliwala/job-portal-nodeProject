const companyModel = require("../../models/companyModel");

// Create Company
const createCompany = async (req, res) => {
    try {
        console.log("controller", req.body);

        const {
            recruiterId,
            companyName,
            description,
            industry,
            location,
            website
        } = req.body;

        console.log(req.body);

        if (!recruiterId || !companyName || !description || !industry || !location || !website) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // Check if company already exists
        const existingCompany = await companyModel.findOne({
            companyName
        });

        if (existingCompany) {
            return res.status(400).json({
                status: false,
                message: "Company name already registered"
            });
        }

        // Create company
        const company = await companyModel.create({
            recruiterId,
            companyName,
            description,
            industry,
            location,
            website
        });

        res.status(201).json({
            status: true,
            message: "Company created successfully",
            data: company
        });

    } catch (error) {
        console.log("Error in create company controller", error);

        res.status(500).json({
            status: false,
            message: "Failed to create company",
            data:error
        });
    }
};


// Get All Companies
const getCompany = async (req, res) => {
    try {

        const companies = await companyModel.find();

        res.status(200).json({
            status: true,
            count: companies.length,
            data: companies
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get companies",
            data: error
        });
    }
};


// Get Single Company
const getCompanyById = async (req, res) => {
    try {
        const {id} = req.params
        const company = await companyModel.findById(id);

        if (!company) {
            return res.status(404).json({
                status: false,
                message: "Company not found"
            });
        }

        console.log(company)

        res.status(200).json({
            status: true,
            message:"fetch Sucessfull",
            data: company
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get company",
            error: error.message
        });
    }
};


// Update Company
const updateCompany = async (req, res) => {
    try {
        const {id} = req.params
        const {
            recruiterId,
            companyName,
            description,
            industry,
            location,
            website
        } = req.body;

        const company = await companyModel.findByIdAndUpdate(id,
            {
                recruiterId,
                companyName,
                description,
                industry,
                location,
                website
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                status: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Company updated successfully",
            data: company
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to update company",
            error: error.message
        });
    }
};


// Delete Company
const deleteCompany = async (req, res) => {
    try {
        const {id} = req.params
        const company = await companyModel.findOneAndDelete(id);

        if (!company) {
            return res.status(404).json({
                status: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Company deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to delete company",
            error: error.message
        });
    }
};


module.exports = {
    createCompany,
    getCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
};