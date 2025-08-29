import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

dotenv.config();

export async function login({ email, password }) {
    const [result] = await pool.query(`
        SELECT id, username, email, password
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    if (result.length === 0) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const user = result[0]

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
    
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
    
    await pool.query(
        `UPDATE users SET refresh_token = ? WHERE id = ?`,
        [refreshToken, user.id]
    );
    
    return { accessToken, refreshToken };
}

export async function logout(userId) {
    await pool.query(
        `UPDATE users SET refresh_token = NULL WHERE id = ?`,
        [userId]
    );

    return { message: 'Logged out successfully' };
}