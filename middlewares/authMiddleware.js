import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

dotenv.config();

export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Unauthorized request" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Access token required" });
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const [rows] = await pool.query(
            `SELECT token_version FROM users WHERE id = ?`,
            [payload.id]
        );

        if (!rows.length || rows[0].token_version !== payload.tokenVersion) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        req.userId = payload.id
        return next();

    } catch (err) {
        if (err.name !== "TokenExpiredError") {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }

        // Check refresh token
        const refreshToken = req.headers['x-refresh-token'];
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Access token expired. Refresh token required.' });
        }

        try {
            console.log("Access token expired")
            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const [rows] = await pool.query(
                `SELECT refresh_token FROM users WHERE id = ?`,
                [user.id]
            );

            if (rows.length === 0 || rows[0].refresh_token !== refreshToken) {
                return res.status(403).json({ success: false, message: 'Logout or Invalid refresh token' });
            }

            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                tokenVersion: user.token_version
            };

            // Generate a new access token
            const newAccessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // Attach new access token to response headers
            res.setHeader('x-access-token', newAccessToken);
            req.userId = user.id;
            return next();

        } catch (refreshErr) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
    }
}
