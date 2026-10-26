const express = require("express");

const {
    createCandidateProfile,
    getCandidate,
    getCandidateById,
    updateCandidate,
    deleteCandidate
} = require("../../controllers/candidate/candidateController");

const router = express.Router();

router.post("/", createCandidateProfile);


// @/api/company/
router.get("/", getCandidate);

router.get("/:id", getCandidateById);

router.put("/:id", updateCandidate);

router.delete("/:id", deleteCandidate);

module.exports = router;