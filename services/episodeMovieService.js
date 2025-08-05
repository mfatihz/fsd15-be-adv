import { pool } from './pool.js'

export async function addEpisodeMovie({
    id_series_film,
    no_episode,
    tanggal_keluar,
    judul,
    ringkasan,
    durasi,
    tanggal_ditambahkan
}) {
    const [result] = await pool.query(`
        INSERT INTO episode_movie (
            id_series_film,
            no_episode,
            tanggal_keluar,
            judul,
            ringkasan,
            durasi,
            tanggal_ditambahkan
        ) VALUES (?,?,?,?,?,?,?)
        `, [
        id_series_film,
        no_episode,
        tanggal_keluar,
        judul,
        ringkasan,
        durasi,
        tanggal_ditambahkan
    ])
    return await getEpisodeMovie({id: result.insertId})
}

export async function getEpisodeMovies() {
    const [rows] = await pool.query(`
        SELECT * FROM episode_movie
    `)
    return rows
}

export async function getEpisodeMovie({id}) {
    const [rows] = await pool.query(`
        SELECT *
        FROM episode_movie
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function updateEpisodeMovie({
    id,
    id_series_film,
    no_episode,
    tanggal_keluar,
    judul,
    ringkasan,
    durasi,
    tanggal_ditambahkan
}) {
    const [result] = await pool.query(`
        UPDATE episode_movie SET
            id_series_film = ?,
            no_episode = ?,
            tanggal_keluar = ?,
            judul = ?,
            ringkasan = ?,
            durasi = ?,
            tanggal_ditambahkan = ?
        WHERE id = ?
        `, [
        id_series_film,
        no_episode,
        tanggal_keluar,
        judul,
        ringkasan,
        durasi,
        tanggal_ditambahkan,
        id
    ])
    return await getEpisodeMovie({id})
}

export async function deleteEpisodeMovie({id}) {
    const [rows] = await pool.query(`
        DELETE FROM episode_movie
        WHERE id = ?
        `, [id])
    
    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Episode/Movie not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}