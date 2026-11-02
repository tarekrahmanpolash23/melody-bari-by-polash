const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);
router.delete("/users", authMiddleware, deleteUser);

module.exports = router;