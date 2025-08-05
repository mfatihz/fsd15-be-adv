import { pool } from './pool.js'

export async function addPayment({
    metode_bayar,
    biaya_admin,
}) {
    const [result] = await pool.query(`
        INSERT INTO pembayaran (
            metode_bayar,
            biaya_admin
        ) VALUES (?,?)
        `, [
        metode_bayar,
        biaya_admin
    ])
    return await getPayment({ id: result.insertId })
}

export async function getPayments() {
    const [rows] = await pool.query(`
        SELECT * FROM pembayaran
    `)
    return rows
}

export async function getPayment({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM pembayaran
        WHERE id = ?
        `, [id]
    )
    return rows[0]
}

export async function updatePayment({
    id,
    metode_bayar,
    biaya_admin,
}) {
    const [result] = await pool.query(`
        UPDATE pembayaran SET
            metode_bayar = ?,
            biaya_admin = ?
        WHERE id = ?
        `, [
        metode_bayar,
        biaya_admin,
        id
    ])
    return await getPayment({ id })
}

export async function deletePayment({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM pembayaran
        WHERE id = ?
        `, [id])
    
    const result = await rows.affectedRows
    
    if (result === 0) {
        const error = new Error("Payment method not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}