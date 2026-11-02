const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required!"
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered!"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to register user!"
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required!"
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
        }

        const user = result.rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
        }
const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    "melody_bari_secret_key",
    {
        expiresIn: "7d"
    }
);
        res.json({
    success: true,
    message: "Login successful!",
    token: token,
    data: {
        id: user.id,
        name: user.name,
        email: user.email
    }
});

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to login!"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        res.json({
            success: true,
            message: "Profile retrieved successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile!"
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user exists
        const userResult = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Delete user
        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [userId]
        );

        res.json({
            success: true,
            message: "User deleted successfully!"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user!"
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    deleteUser
};