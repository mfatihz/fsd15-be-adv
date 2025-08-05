import { pool } from './pool.js'

export async function addGenre({
    label,
    format_path,
}) {
    const [result] = await pool.query(`
        INSERT INTO genres (
            label,
            format_path
        ) VALUES (?,?)
        `, [
        label,
        format_path
    ])
    return await getGenre({ id: result.insertId })
}

export async function getGenres() {
    const [rows] = await pool.query(`
        SELECT * FROM genres
    `)
    return rows
}

export async function getGenre({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM genres
        WHERE id = ?
        `, [id]
    )
    return rows[0]
}

export async function updateGenre({
    id,
    label,
    format_path,
}) {
    const [result] = await pool.query(`
        UPDATE genres SET
            label = ?,
            format_path = ?
        WHERE id = ?
        `, [
        label,
        format_path,
        id
    ])
    return await getGenre({ id })
}

export async function deleteGenre({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM genres
        WHERE id = ?
        `, [id]
    )
    
    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Genre not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}