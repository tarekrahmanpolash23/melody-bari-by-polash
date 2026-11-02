const express = require("express");
const pool = require("./db");

const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.static(require('path').join(__dirname, 'public')));

app.use(express.json());

// API Routes
app.use(songRoutes);
app.use(playlistRoutes);
app.use(favoriteRoutes);
app.use(userRoutes);

// Database Test
app.get("/db-test", async (req, res, next) => {
    try {
        await pool.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "Database connected!"
        });
    } catch (error) {
        next(error);
    }
});

// Home Route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Melody Bari Backend!");
});

// Unknown Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found!"
    });
});


// Global Error Handler
app.use((error, req, res, next) => {
    console.error("Server Error:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    // Invalid JSON error
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format!"
        });
    }

    // Other errors
    res.status(500).json({
        success: false,
        message: "Internal server error!"
    });
});



// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});