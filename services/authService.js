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

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    return accessToken;
}