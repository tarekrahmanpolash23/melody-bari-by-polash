
const pool = require("../db");

// ========================================
// CREATE SONG
// ========================================
const createSong = async (req, res) => {
    try {
        const {
            title,
            artist,
            year,
            language,
            mood,
            activity,
            era,
            gender,
            external_music_id
        } = req.body;

        if (typeof title !== "string" || typeof artist !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title and artist must be text!"
            });
        }

        if (!title.trim() || !artist.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and artist are required!"
            });
        }

        if (
            typeof year !== "number" ||
            !Number.isInteger(year) ||
            year < 1 ||
            year > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Year must be a valid positive integer!"
            });
        }

        const optionalFields = {
            language,
            mood,
            activity,
            era,
            gender,
            external_music_id
        };

        for (const [fieldName, fieldValue] of Object.entries(optionalFields)) {
            if (fieldValue !== undefined && fieldValue !== null) {
                if (typeof fieldValue !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: `${fieldName} must be text!`
                    });
                }
            }
        }

        const result = await pool.query(
            `INSERT INTO songs
            (title, artist, year, language, mood, activity, era, gender, external_music_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                title.trim(),
                artist.trim(),
                year,
                language,
                mood,
                activity,
                era,
                gender,
                external_music_id
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Song created successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Create Song Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save song!"
        });
    }
};

// ========================================
// GET ALL SONGS + FILTERS
// ========================================
const getAllSongs = async (req, res) => {
    try {
        const { mood, activity, era, language, gender } = req.query;

        let query = "SELECT * FROM songs";
        const values = [];

        const filters = { mood, activity, era, language, gender };

        for (const [field, value] of Object.entries(filters)) {
            if (value !== undefined) {
                values.push(value);

                query += values.length === 1
                    ? ` WHERE ${field} ILIKE $${values.length}`
                    : ` AND ${field} ILIKE $${values.length}`;
            }
        }

        query += " ORDER BY id ASC";

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            message: "Songs fetched successfully!",
            data: result.rows
        });
    } catch (error) {
        console.error("Get All Songs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get songs!"
        });
    }
};

// ========================================
// GET SONG BY ID
// ========================================
const getSongById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isSafeInteger(id) ||
            id < 1 ||
            id > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        const result = await pool.query(
            "SELECT * FROM songs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Song retrieved successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Get Song By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get song!"
        });
    }
};

// ========================================
// UPDATE SONG
// ========================================
const updateSong = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isSafeInteger(id) ||
            id < 1 ||
            id > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        const {
            title,
            artist,
            year,
            language,
            mood,
            activity,
            era,
            gender,
            external_music_id
        } = req.body;

        if (typeof title !== "string" || typeof artist !== "string") {
            return res.status(400).json({
                success: false,
                message: "Title and artist must be text!"
            });
        }

        if (!title.trim() || !artist.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and artist are required!"
            });
        }

        if (
            typeof year !== "number" ||
            !Number.isInteger(year) ||
            year < 1 ||
            year > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Year must be a valid positive integer!"
            });
        }

        const optionalFields = {
            language,
            mood,
            activity,
            era,
            gender,
            external_music_id
        };

        for (const [fieldName, fieldValue] of Object.entries(optionalFields)) {
            if (fieldValue !== undefined && fieldValue !== null) {
                if (typeof fieldValue !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: `${fieldName} must be text!`
                    });
                }
            }
        }

        const result = await pool.query(
            `UPDATE songs
             SET title = $1,
                 artist = $2,
                 year = $3,
                 language = $4,
                 mood = $5,
                 activity = $6,
                 era = $7,
                 gender = $8,
                 external_music_id = $9
             WHERE id = $10
             RETURNING *`,
            [
                title.trim(),
                artist.trim(),
                year,
                language,
                mood,
                activity,
                era,
                gender,
                external_music_id,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Song updated successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Update Song Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update song!"
        });
    }
};

// ========================================
// DELETE SONG
// ========================================
const deleteSong = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isSafeInteger(id) ||
            id < 1 ||
            id > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        const result = await pool.query(
            "DELETE FROM songs WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Song deleted successfully!",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Delete Song Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete song!"
        });
    }
};

// ========================================
// SEARCH SONGS
// ========================================
const searchSongs = async (req, res) => {
    try {
        const { q } = req.query;

        if (typeof q !== "string" || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required!"
            });
        }

        const searchTerm = `%${q.trim()}%`;

        const result = await pool.query(
            `SELECT *
             FROM songs
             WHERE title ILIKE $1
                OR artist ILIKE $1
             ORDER BY id ASC`,
            [searchTerm]
        );

        return res.status(200).json({
            success: true,
            message: "Songs search completed successfully!",
            data: result.rows
        });
    } catch (error) {
        console.error("Search Songs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search songs!"
        });
    }
};

// ========================================
// GENERATE SMART PLAYLIST
// ========================================
const generateSmartPlaylist = async (req, res) => {
    try {
        const { mood, activity, era, language, gender } = req.query;

        let playlistName = "Melody Bari Mix";

        if (era && mood && activity) {
            if (activity.toLowerCase() === "driving") {
                playlistName = `${era} ${mood} Night Drive`;
            } else if (activity.toLowerCase() === "coding") {
                playlistName = `${era} ${mood} Coding Vibes`;
            } else if (activity.toLowerCase() === "study") {
                playlistName = `${era} ${mood} Study Sessions`;
            } else if (activity.toLowerCase() === "gym") {
                playlistName = `${era} ${mood} Gym Energy`;
            } else {
                playlistName = `${era} ${mood} ${activity}`;
            }
        }

        let query = "SELECT * FROM songs";
        const values = [];
        const filters = { mood, activity, era, language, gender };

        for (const [field, value] of Object.entries(filters)) {
            if (value !== undefined) {
                values.push(value);

                query += values.length === 1
                    ? ` WHERE ${field} ILIKE $${values.length}`
                    : ` AND ${field} ILIKE $${values.length}`;
            }
        }

        query += " ORDER BY id ASC";

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No songs found matching your criteria!"
            });
        }

        const playlistResult = await pool.query(
            `INSERT INTO playlists (name, description, userid)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                playlistName,
                `Smart playlist generated from ${mood || "any mood"}, ${activity || "any activity"}, ${era || "any era"}`,
                req.user.id
            ]
        );

        const playlistId = playlistResult.rows[0].id;

        for (let i = 0; i < result.rows.length; i++) {
            await pool.query(
                `INSERT INTO playlist_songs (playlist_id, song_id, position)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (playlist_id, song_id) DO NOTHING`,
                [playlistId, result.rows[i].id, i + 1]
            );
        }

        return res.status(201).json({
            success: true,
            message: "Smart playlist generated successfully!",
            playlist_name: playlistName,
            playlist_id: playlistId,
            data: result.rows
        });
    } catch (error) {
        console.error("Generate Smart Playlist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate smart playlist!"
        });
    }
};

// ========================================
// DISCOVER SONGS
// ========================================
const discoverSongs = async (req, res) => {
    try {
        const { mood, activity, era, language, gender } = req.query;

        let query = "SELECT * FROM songs";
        const values = [];
        const filters = { mood, activity, era, language, gender };

        for (const [field, value] of Object.entries(filters)) {
            if (value !== undefined) {
                values.push(value);

                query += values.length === 1
                    ? ` WHERE ${field} ILIKE $${values.length}`
                    : ` AND ${field} ILIKE $${values.length}`;
            }
        }

        query += " ORDER BY id ASC";

        const result = await pool.query(query, values);

        let discoveryTitle = "Melody Bari Discover";
        let discoveryReason = "A selection of songs for you.";

        if (mood && activity && era) {
            discoveryTitle = `${era} ${mood} ${activity}`;
            discoveryReason =
                `Songs selected for ${mood} mood and ${activity} activity from the ${era}.`;
        } else if (mood && activity) {
            discoveryTitle = `${mood} ${activity}`;
            discoveryReason =
                `Songs selected for your ${mood} mood while ${activity}.`;
        } else if (mood) {
            discoveryTitle = `${mood} Mood`;
            discoveryReason = `Songs selected based on your ${mood} mood.`;
        } else if (activity) {
            discoveryTitle = `${activity} Vibes`;
            discoveryReason = `Songs selected for ${activity}.`;
        } else if (era) {
            discoveryTitle = `${era} Music`;
            discoveryReason = `Songs selected from the ${era}.`;
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No songs found for your discovery!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Songs discovered successfully!",
            discovery: {
                title: discoveryTitle,
                reason: discoveryReason
            },
            filters: {
                mood: mood || null,
                activity: activity || null,
                era: era || null,
                language: language || null,
                gender: gender || null
            },
            data: result.rows
        });
    } catch (error) {
        console.error("Discover Songs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to discover songs!"
        });
    }
};

module.exports = {
    createSong,
    getAllSongs,
    getSongById,
    updateSong,
    deleteSong,
    searchSongs,
    generateSmartPlaylist,
    discoverSongs
};

