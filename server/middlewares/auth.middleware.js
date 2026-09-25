const jwt = require("jsonwebtoken")
const User = require("../models/user.models")

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token && req.headers.cookie) {
            const cookieToken = req.headers.cookie
                .split(";")
                .map((cookie) => cookie.trim())
                .find((cookie) => cookie.startsWith("token="));

            if (cookieToken) {
                token = `Bearer ${decodeURIComponent(cookieToken.split("=")[1])}`;
            }
        }

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        }

        return res.status(401).json({ message: "Not authorized, no token" });
    } catch (error) {
        return res.status(401).json({ message: "Token failed", error: error.message });
    }
};

module.exports = { protect };