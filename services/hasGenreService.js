import { getGenre } from './genreService.js'
import { pool } from './pool.js'

export async function addGenreToSeriesFilm({ filmId, genreId }) {
    const [rows] = await pool.query(`
        INSERT INTO memiliki_genres (
            id_series_film,
            id_genre
        ) VALUE (?,?)
        `, [filmId, genreId]
    )
    return await getGenre({ id: genreId })
}

export async function getSeriesFilmHasGenre({ filmId }) {
    const [rows] = await pool.query(`
        SELECT g.id, g.label, g.format_path
        FROM memiliki_genres mg
        JOIN genres g
        ON mg.id_genre = g.id
        WHERE mg.id_series_film = ?
        `, [filmId]
    )
    return rows
}

export async function getGenreHasSeriesFilm({ genreId }) {
    const [rows] = await pool.query(`
        SELECT sf.id, sf.tipe, sf.judul
        FROM memiliki_genres mg
        JOIN series_film sf
        ON mg.id_series_film = sf.id
        WHERE mg.id_genre = ?
        `, [genreId]
    )
    return rows
}

// multi-rows ops
export async function updateGenresToSeriesFilm({ filmId, genreIds }) {
    let conn;
    try {
        conn = await pool.getConnection()

        await conn.beginTransaction()

        await conn.query(`DELETE FROM memiliki_genres WHERE id_series_film = ?`, [filmId])

        for (const genreId of genreIds) {
            await conn.query(`INSERT INTO memiliki_genres (id_series_film, id_genre) VALUE (?,?)`, [filmId, genreId])
        }

        await conn.commit()

        console.log('Transaction berhasil.');
        return genreIds
    } catch (err) {
        conn.rollback()
        if (conn) {
            console.error('Rollback transaction karena error:', err);
        } else {
            console.error('Connection error:', err);
        }
        return "Gagal memperbarui genre."
    } finally {
        conn.release()
    }
}

export async function deleteGenreFromSeriesFilm({ filmId, genreId }) {
    const [rows] = await pool.query(`
        DELETE FROM memiliki_genres
        WHERE id_series_film = ? AND id_genre = ?
        `, [filmId, genreId]
    )

    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Genre not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}