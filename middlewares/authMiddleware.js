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
        req.userId = payload.id
        return next();

    } catch (err) {
        console.log("Access token expired")
        if (err.name !== "TokenExpiredError") {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }


        // Check if refresh token is provided
        const refreshToken = req.headers['x-refresh-token'];
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Access token expired. Refresh token required.' });
        }

        try {
            // Verify refresh token
            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Validate refresh token against DB
            const [rows] = await pool.query(
                `SELECT refresh_token FROM users WHERE id = ?`,
                [user.id]
            );

            if (rows.length === 0 || rows[0].refresh_token !== refreshToken) {
                return res.status(403).json({ success: false, message: 'Invalid refresh token' });
            }

            const payload = {
                id: user.id,
                username: user.username,
                email: user.email
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
            return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
        }
    }

}
