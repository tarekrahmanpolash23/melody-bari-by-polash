const express = require("express");

const {
    addFavorite,
    getAllFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ADD FAVORITE
// ========================================

router.post("/favorites", authMiddleware, addFavorite);


// ========================================
// GET ALL FAVORITES
// ========================================

router.get("/favorites", authMiddleware, getAllFavorites);


// ========================================
// REMOVE FAVORITE
// ========================================

router.delete("/favorites/:songId", authMiddleware, removeFavorite);


module.exports = router;