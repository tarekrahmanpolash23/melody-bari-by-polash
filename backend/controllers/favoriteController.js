const pool = require("../db");


// ========================================
// ADD SONG TO FAVORITES
// ========================================

const addFavorite = async (req, res) => {
    try {
        // JWT থেকে logged-in user's ID
        const userId = req.user.id;

        const { song_id } = req.body;

        // Check song ID
        if (!song_id) {
            return res.status(400).json({
                success: false,
                message: "Song ID is required!"
            });
        }

        const songId = Number(song_id);

if (!Number.isInteger(songId) || songId < 1) {
    return res.status(400).json({
        success: false,
        message: "Invalid song ID!"
    });
}

        // Check if song exists
        const songResult = await pool.query(
            `SELECT id
             FROM songs
             WHERE id = $1`,
            [songId]
        );

        if (songResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found!"
            });
        }

        // Add favorite
        const result = await pool.query(
            `INSERT INTO favorites (userid, song_id)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, songId]
        );

        res.status(201).json({
            success: true,
            message: "Song added to favorites successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        // Duplicate favorite
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Song is already in favorites!"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to add song to favorites!"
        });
    }
};


// ========================================
// GET ALL FAVORITES
// ========================================

const getAllFavorites = async (req, res) => {
    try {
        // JWT থেকে logged-in user's ID
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                favorites.id AS favorite_id,
                songs.id,
                songs.title,
                songs.artist,
                songs.year,
                songs.language,
                songs.mood,
                songs.activity,
                songs.era,
                songs.gender,
                songs.external_music_id,
                favorites.created_at
             FROM favorites
             JOIN songs
                ON favorites.song_id = songs.id
             WHERE favorites.userid = $1
             ORDER BY favorites.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            message: "Favorite songs retrieved successfully!",
            data: result.rows
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to get favorite songs!"
        });
    }
};


// ========================================
// REMOVE SONG FROM FAVORITES
// ========================================

const removeFavorite = async (req, res) => {
    try {
        // JWT থেকে logged-in user's ID
        const userId = req.user.id;

        const songId = Number(req.params.songId);

if (!Number.isInteger(songId) || songId < 1) {
    return res.status(400).json({
        success: false,
        message: "Invalid song ID!"
    });
}
       const result = await pool.query(
            `DELETE FROM favorites
             WHERE userid = $1
             AND song_id = $2
             RETURNING *`,
            [userId, songId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song is not in favorites!"
            });
        }

        res.json({
            success: true,
            message: "Song removed from favorites successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove song from favorites!"
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    addFavorite,
    getAllFavorites,
    removeFavorite
};