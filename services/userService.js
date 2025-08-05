import { pool } from "./pool.js";
import bcrypt from 'bcrypt'

const saltRounds = 10; // Note: Recommended value between 10 and 12

export async function addUser({ username, email, plainPassword }) {
    if (!username || !email || !plainPassword) {
        const error = new Error('All fields are required');
        error.statusCode = 400;
        throw error;
    }

    const password = await bcrypt.hash(plainPassword, saltRounds)

    try {
        // TODO: pindah ke layer Model
        const [result] = await pool.query(`
            INSERT INTO users (
                username,
                email,
                password
            ) VALUES (?,?,?)
            `,
            [username, email, password]
        );
        return { id: result.insertId, username, email };
    } catch (err) {
        // error duplikat
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('Email sudah terdaftar');
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
    return rows;
}

export async function getUser({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id]
    );
    return rows[0];
}

export async function updateUser({ id, username = null, plainPassword = null }) {
    const password = plainPassword ? await bcrypt.hash(plainPassword, saltRounds) : null
    let conn;
    try {
        const oUser = await getUser({ id })

        conn = await pool.getConnection()
        await conn.beginTransaction()

        const [result] = await pool.query(`
            UPDATE users SET
                username = ?,
                password = ?
            WHERE id = ?
            `,
            [
                username || oUser.username,
                password || oUser.password,
                id
            ]
        );

        await conn.commit()

        console.log('Users transaction berhasil.');
        
        const nUser = await getUser({ id })
        return { id: nUser.id, username: nUser.username, email: nUser.email};
    } catch (err) {
        if (conn) {
            conn.rollback()

            console.error('Rollback Users transaction karena error:', err);
            const error = new Error('Email sudah terdaftar');
            error.statusCode = 409;
            throw error;
        }

        // error lain
        console.error('Connection error:', err);
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
    } finally {
        conn.release()
    }
}

export async function deleteUser({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
    );
    
    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("User not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}
