const express = require("express");

const {
    createCompany,
    getCompany,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../../controllers/company/companyController");

const router = express.Router();

router.post("/", createCompany);


// @/api/company/
router.get("/", getCompany);

router.get("/:id", getCompanyById);

router.put("/:id", updateCompany);

router.delete("/:id", deleteCompany);

module.exports = router;