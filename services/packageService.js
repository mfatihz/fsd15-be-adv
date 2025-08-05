import { pool } from './pool.js'

export async function addPackage({
    nama_paket,
    jumlah_akun,
    biaya_paket,
    keuntungan
}) {
    const [result] = await pool.query(`
        INSERT INTO paket (
            nama_paket,
            jumlah_akun,
            biaya_paket,
            keuntungan
        ) VALUES (?,?,?,?)
        `, [
        nama_paket,
        jumlah_akun,
        biaya_paket,
        keuntungan
    ])
    return await getPackage({ id: result.insertId })
}

export async function getPackages() {
    const [rows] = await pool.query(`
        SELECT * FROM paket
    `)
    return rows
}

export async function getPackage({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM paket
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function updatePackage({
    id,
    nama_paket,
    jumlah_akun,
    biaya_paket,
    keuntungan
}) {
    const [result] = await pool.query(`
        UPDATE paket SET
            nama_paket = ?,
            jumlah_akun = ?,
            biaya_paket = ?,
            keuntungan = ?
        WHERE id = ?
        `, [
        nama_paket,
        jumlah_akun,
        biaya_paket,
        keuntungan,
        id
    ])
    return await getPackage({ id })
}

export async function deletePackage({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM paket
        WHERE id = ?
        `, [id]
    )
    
    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Package not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}