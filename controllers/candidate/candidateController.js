const CandidateProfileModel = require("../../models/CandidateProfileModel");

// Create Company
const createCandidateProfile = async (req, res) => {
    try {
        console.log("candidate", req.body);

        const {
            user,
            name,
            skills,
            experience,
            education,
            professionalInformation
        } = req.body;

        console.log(req.body);

        if (!user || !name || !skills || !experience || !education || !professionalInformation) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        // Check if company already exists
        const existingCandidate = await CandidateProfileModel.findOne({
            user
        });

        if (existingCandidate) {
            return res.status(400).json({
                status: false,
                message: "Company name already registered"
            });
        }

        // Create Candidate
        const candidate = await CandidateProfileModel.create({
            user,
            name,
            skills,
            experience,
            education,
            professionalInformation
        });

        res.status(201).json({
            status: true,
            message: "Candidate created successfully",
            data: candidate
        });

    } catch (error) {
        console.log("Error in create Candidate controller", error);

        res.status(500).json({
            status: false,
            message: "Failed to create Candidate",
            data:error
        });
    }
};


// Get All Companies
const getCandidate = async (req, res) => {
    try {

        const candidates = await CandidateProfileModel.find();

        res.status(200).json({
            status: true,
            count: candidates.length,
            data: candidates
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get candidates",
            data: error
        });
    }
};


// Get Single Company
const getCandidateById = async (req, res) => {
    try {
        const {id} = req.params
        const candidate = await CandidateProfileModel.findById(id);

        if (!candidate) {
            return res.status(404).json({
                status: false,
                message: "candidate not found"
            });
        }

        console.log(candidate)

        res.status(200).json({
            status: true,
            message:"fetch Sucessfull",
            data: candidate
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to get company",
            data:error
        });
    }
};

// Update Company
const updateCandidate = async (req, res) => {
    try {
        const {id} = req.params
        const {
            user,
            name,
            skills,
            experience,
            education,
            professionalInformation
        } = req.body;

        const candidate = await CandidateProfileModel.findByIdAndUpdate(id,
            {
                user,
            name,
            skills,
            experience,
            education,
            professionalInformation
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!candidate) {
            return res.status(404).json({
                status: false,
                message: "candidate not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "candidate updated successfully",
            data: candidate
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to update candidate",
            data:error
        });
    }
};


// Delete candidate
const deleteCandidate = async (req, res) => {
    try {
        const {id} = req.params
        const candidate = await CandidateProfileModel.findOneAndDelete(id);

        if (!candidate) {
            return res.status(404).json({
                status: false,
                message: "candidate not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "candidate deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to delete company",
            data:error
        });
    }
};


module.exports = {
    createCandidateProfile,
    getCandidate,
    getCandidateById,
    updateCandidate,
    deleteCandidate
};

// | Controller                    | CRUD                                       |
// | ----------------------------- | ------------------------------------------ |
// | `userController.js`           | Create, Read All, Read One, Update, Delete |
// | `companyController.js`        | Create, Read All, Read One, Update, Delete |
// | `candidateController.js`      | Create, Read All, Read One, Update, Delete |
// | `jobCategoryController.js`    | Create, Read All, Read One, Update, Delete |
// | `jobController.js`            | Create, Read All, Read One, Update, Delete |
// | `jobApplicationController.js` | Create, Read All, Read One, Update, Delete |
// | `resumeController.js`         | Create, Read All, Read One, Update, Delete |
