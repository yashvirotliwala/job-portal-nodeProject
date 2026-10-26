const express = require("express");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../../controllers/users/userController");

const router = express.Router();

router.post("/register", createUser);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;