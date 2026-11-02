const pool = require("../db");

// ========================================
// 1. GET PLAYLIST SONGS
// ========================================

const getPlaylistSongs = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        const result = await pool.query(
            `SELECT
                playlists.name AS playlist_name,
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
                playlist_songs.position
             FROM playlist_songs
             JOIN playlists
                ON playlist_songs.playlist_id = playlists.id
             JOIN songs
                ON playlist_songs.song_id = songs.id
             WHERE playlists.id = $1
             AND playlists.userid = $2
             ORDER BY playlist_songs.position ASC`,
            [playlistId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found or has no songs!"
            });
        }

        res.json({
            success: true,
            message: "Playlist songs retrieved successfully!",
            data: result.rows
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to get playlist songs!"
        });
    }
};


// ========================================
// 2. CREATE PLAYLIST
// ========================================

const createPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;

        const { name, description } = req.body;

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Playlist name is required and must be text!"
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Playlist name must be 100 characters or less!"
            });
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Playlist description must be text!"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Playlist description must be 500 characters or less!"
            });
        }

        const result = await pool.query(
            `INSERT INTO playlists (name, description, userid)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                name.trim(),
                description ? description.trim() : null,
                userId
            ]
        );

        res.status(201).json({
            success: true,
            message: "Playlist created successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to create playlist!"
        });
    }
};


// ========================================
// 3. GET ALL PLAYLISTS
// ========================================

const getAllPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT *
             FROM playlists
             WHERE userid = $1
             ORDER BY id ASC`,
            [userId]
        );

        res.json({
            success: true,
            message: "Playlists retrieved successfully!",
            data: result.rows
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to get playlists!"
        });
    }
};


// ========================================
// 4. GET PLAYLIST BY ID
// ========================================

const getPlaylistById = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        const result = await pool.query(
            `SELECT *
             FROM playlists
             WHERE id = $1
             AND userid = $2`,
            [playlistId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        res.json({
            success: true,
            message: "Playlist retrieved successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to get playlist!"
        });
    }
};


// ========================================
// 5. UPDATE PLAYLIST
// ========================================

const updatePlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);

        const { name, description } = req.body;

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Playlist name is required and must be text!"
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Playlist name must be 100 characters or less!"
            });
        }

        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Playlist description must be text!"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Playlist description must be 500 characters or less!"
            });
        }

        const result = await pool.query(
            `UPDATE playlists
             SET name = $1,
                 description = $2
             WHERE id = $3
             AND userid = $4
             RETURNING *`,
            [
                name.trim(),
                description ? description.trim() : null,
                playlistId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        res.json({
            success: true,
            message: "Playlist updated successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to update playlist!"
        });
    }
};


// ========================================
// 6. DELETE PLAYLIST
// ========================================

const deletePlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        const result = await pool.query(
            `DELETE FROM playlists
             WHERE id = $1
             AND userid = $2
             RETURNING *`,
            [playlistId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        res.json({
            success: true,
            message: "Playlist deleted successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete playlist!"
        });
    }
};


// ========================================
// 7. ADD SONG TO PLAYLIST
// ========================================

const addSongToPlaylist = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);

        const songId = Number(req.body.songId);

        // Validate playlist ID
        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        // Validate song ID
        if (!req.body.songId) {
            return res.status(400).json({
                success: false,
                message: "Song ID is required!"
            });
        }

        if (!Number.isInteger(songId) || songId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        // Check playlist ownership
        const playlistResult = await client.query(
            `SELECT id
             FROM playlists
             WHERE id = $1
             AND userid = $2`,
            [playlistId, userId]
        );

        if (playlistResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        // Check song exists
        const songResult = await client.query(
            `SELECT *
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

        // Check duplicate song
        const duplicateResult = await client.query(
            `SELECT *
             FROM playlist_songs
             WHERE playlist_id = $1
             AND song_id = $2`,
            [playlistId, songId]
        );

        if (duplicateResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Song already exists in this playlist!"
            });
        }

        // Get next position
        const positionResult = await client.query(
            `SELECT COALESCE(MAX(position), 0) + 1 AS next_position
             FROM playlist_songs
             WHERE playlist_id = $1`,
            [playlistId]
        );

        const nextPosition = Number(positionResult.rows[0].next_position);

        // Insert song
        const result = await client.query(
            `INSERT INTO playlist_songs
             (playlist_id, song_id, position)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [playlistId, songId, nextPosition]
        );

        res.status(201).json({
            success: true,
            message: "Song added to playlist successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to add song to playlist!"
        });

    } finally {
        client.release();
    }
};


// ========================================
// 8. REMOVE SONG FROM PLAYLIST
// ========================================

const removeSongFromPlaylist = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);
        const songId = Number(req.params.songId);

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        if (!Number.isInteger(songId) || songId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        const playlistResult = await client.query(
            `SELECT id
             FROM playlists
             WHERE id = $1
             AND userid = $2`,
            [playlistId, userId]
        );

        if (playlistResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        const songResult = await client.query(
            `SELECT *
             FROM playlist_songs
             WHERE playlist_id = $1
             AND song_id = $2`,
            [playlistId, songId]
        );

        if (songResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found in your playlist!"
            });
        }

        const removedSong = songResult.rows[0];

        await client.query("BEGIN");

        await client.query(
            `DELETE FROM playlist_songs
             WHERE playlist_id = $1
             AND song_id = $2`,
            [playlistId, songId]
        );

        await client.query(
            `UPDATE playlist_songs
             SET position = position - 1
             WHERE playlist_id = $1
             AND position > $2`,
            [playlistId, removedSong.position]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Song removed from playlist successfully!",
            data: removedSong
        });

    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.log(rollbackError);
        }

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove song from playlist!"
        });

    } finally {
        client.release();
    }
};


// ========================================
// 9. REORDER PLAYLIST SONG
// ========================================

const reorderPlaylistSong = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const playlistId = Number(req.params.id);
        const songId = Number(req.params.songId);

        const { position } = req.body;
        const newPosition = Number(position);

        if (!Number.isInteger(playlistId) || playlistId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid playlist ID!"
            });
        }

        if (!Number.isInteger(songId) || songId < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid song ID!"
            });
        }

        if (!Number.isInteger(newPosition) || newPosition < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid position!"
            });
        }

        const playlistResult = await client.query(
            `SELECT id
             FROM playlists
             WHERE id = $1
             AND userid = $2`,
            [playlistId, userId]
        );

        if (playlistResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found!"
            });
        }

        const result = await client.query(
            `SELECT position
             FROM playlist_songs
             WHERE playlist_id = $1
             AND song_id = $2`,
            [playlistId, songId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Song not found in this playlist!"
            });
        }

        const currentPosition = result.rows[0].position;

        const countResult = await client.query(
            `SELECT COUNT(*) AS total
             FROM playlist_songs
             WHERE playlist_id = $1`,
            [playlistId]
        );

        const totalSongs = Number(countResult.rows[0].total);

        if (newPosition > totalSongs) {
            return res.status(400).json({
                success: false,
                message: `Position must be between 1 and ${totalSongs}!`
            });
        }

        await client.query("BEGIN");

        if (newPosition < currentPosition) {
            await client.query(
                `UPDATE playlist_songs
                 SET position = position + 1
                 WHERE playlist_id = $1
                 AND position >= $2
                 AND position < $3`,
                [playlistId, newPosition, currentPosition]
            );

        } else if (newPosition > currentPosition) {
            await client.query(
                `UPDATE playlist_songs
                 SET position = position - 1
                 WHERE playlist_id = $1
                 AND position > $2
                 AND position <= $3`,
                [playlistId, currentPosition, newPosition]
            );
        }

        await client.query(
            `UPDATE playlist_songs
             SET position = $1
             WHERE playlist_id = $2
             AND song_id = $3`,
            [newPosition, playlistId, songId]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Song reordered successfully!",
            data: {
                playlist_id: playlistId,
                song_id: songId,
                position: newPosition
            }
        });

    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.log(rollbackError);
        }

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to reorder playlist song!"
        });

    } finally {
        client.release();
    }
};


// ========================================
// EXPORT ALL CONTROLLERS
// ========================================

module.exports = {
    getPlaylistSongs,
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    reorderPlaylistSong
};