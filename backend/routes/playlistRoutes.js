const express = require("express");

const {
    getPlaylistSongs,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    reorderPlaylistSong,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist
} = require("../controllers/playlistController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PLAYLIST ROUTES
// ========================================

router.get(
    "/playlists",
    authMiddleware,
    getAllPlaylists
);

router.get(
    "/playlists/:id",
    authMiddleware,
    getPlaylistById
);

router.post(
    "/playlists",
    authMiddleware,
    createPlaylist
);

router.put(
    "/playlists/:id",
    authMiddleware,
    updatePlaylist
);

router.delete(
    "/playlists/:id",
    authMiddleware,
    deletePlaylist
);


// ========================================
// PLAYLIST SONG ROUTES
// ========================================

router.get(
    "/playlists/:id/songs",
    authMiddleware,
    getPlaylistSongs
);

router.post(
    "/playlists/:id/songs",
    authMiddleware,
    addSongToPlaylist
);

router.put(
    "/playlists/:id/songs/:songId/reorder",
    authMiddleware,
    reorderPlaylistSong
);

router.delete(
    "/playlists/:id/songs/:songId",
    authMiddleware,
    removeSongFromPlaylist
);


module.exports = router;