const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required!"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format!"
            });
        }

        const decoded = jwt.verify(
            token,
            "melody_bari_secret_key"
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token!"
        });
    }
};

module.exports = authMiddleware;