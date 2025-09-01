import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const saltRounds = 10;

export async function addUser({ fullname, username, email, plainPassword, token }) {
    if (!fullname || !username || !email || !plainPassword) {
        const error = new Error('All fields are required');
        error.statusCode = 400;
        throw error;
    }

    const password = await bcrypt.hash(plainPassword, saltRounds);

    try {
        // TODO: pindah ke layer Model
        const [result] = await pool.query(
            `INSERT INTO users (
                fullname,
                username,
                email,
                password,
                register_token,
                is_verified
            ) VALUES (?,?,?,?,?,?)`,
            [fullname, username, email, password, token, 0]
        );

        return result.insertId;

    } catch (err) {
        // error duplikat
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('Email already registered.');
            error.statusCode = 409;
            throw error;
        }

        // error lain
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
    }
}

export async function getUsers() {
    const [rows] = await pool.query(`
        SELECT * FROM users
    `);
    return rows || [];
}

export async function getUser({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id]
    );
    return rows[0] || [];
}

export async function updateUser({ id, updates }) {
    const keys = Object.keys(updates);
    if (keys.length === 0) throw new Error("No fields to update");

    const updateSets = keys.map(k => `${k} = ?`).join(", ");
    const values = await Promise.all(
        keys.map(async k => {
            if (k.toLowerCase() === "password") {
                return await bcrypt.hash(updates[k], saltRounds);
            } else {
                return updates[k];
            }
        })
    );

    const [result] = await pool.query(
        `UPDATE users SET ${updateSets} WHERE id = ?`,
        [... values, id]
    );

    if (result.affectedRows === 0) {
        const error = new Error("Film not found");
        error.statusCode = 404;
        throw error;
    }

    const user = await getUser({ id })
    return user;
}

export async function deleteUser({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
    );
    
    if (rows.affectedRows === 0) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
}

export async function findByEmail(email) {
    const [result] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return result[0] || null;
}

export async function findByToken(token) {
    const [result] = await pool.query(
        'SELECT id FROM users WHERE register_token = ?',
        [token]
    );

    return result[0] || null;
}

export async function deleteToken(userId) {
    await pool.query(
        'UPDATE users SET register_token = NULL WHERE id = ?',
        [userId]
    )
}

export async function verifyUser(userId) {
    await pool.query(
        'UPDATE users SET is_verified = TRUE WHERE id = ?',
        [userId]
    )
}

export async function setUserToken({ userId, token }) {
    await pool.query(
        'UPDATE users SET register_token = ? WHERE id = ?',
        [token, userId]
    );
}