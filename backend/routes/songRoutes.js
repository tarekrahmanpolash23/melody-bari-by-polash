const express = require("express");

const {
    createSong,
    getAllSongs,
    getSongById,
    updateSong,
    deleteSong,
    searchSongs,
    generateSmartPlaylist,
    discoverSongs
} = require("../controllers/songController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/songs", createSong);

router.get("/songs", getAllSongs);

// Search route MUST come before /songs/:id
router.get("/songs/search", searchSongs);

router.get("/smart-playlist", authMiddleware, generateSmartPlaylist);

router.get("/discover", discoverSongs);

router.get("/songs/:id", getSongById);

router.put("/songs/:id", updateSong);

router.delete("/songs/:id", deleteSong);

module.exports = router;
