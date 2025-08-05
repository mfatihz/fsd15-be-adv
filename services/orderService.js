import { pool } from './pool.js'

export async function addOrder({
    id_user,
    id_paket,
    id_pembayaran,
    kode_bayar,
    kode_voucher,
    tanggal_beli,
    tanggal_bayar
}) {
    const [result] = await pool.query(`
        INSERT INTO orders (
            id_user,
            id_paket,
            id_pembayaran,
            kode_bayar,
            kode_voucher,
            tanggal_beli,
            tanggal_bayar
        ) VALUES (?,?,?,?,?,?,?)
        `, [
        id_user,
        id_paket,
        id_pembayaran,
        kode_bayar,
        kode_voucher,
        tanggal_beli,
        tanggal_bayar
    ])
    return getOrder({ id: result.insertId })
}

export async function getOrders() {
    const [rows] = await pool.query(`
        SELECT
            o.id, kode_bayar, kode_voucher,
            s.username,
            s.email,
            p.nama_paket,
            b.metode_bayar
        FROM orders o
        JOIN users s ON s.id = o.id_user
        JOIN paket p ON p.id = o.id_paket
        JOIN pembayaran  b ON b.id = o.id_pembayaran
    `)
    return rows
}

export async function getOrder({ id }) {
    const [rows] = await pool.query(`
        SELECT
            o.id, kode_bayar, kode_voucher,
            s.username,
            s.email,
            p.nama_paket,
            b.metode_bayar
        FROM orders o
        JOIN users s ON s.id = o.id_user
        JOIN paket p ON p.id = o.id_paket
        JOIN pembayaran  b ON b.id = o.id_pembayaran
        WHERE o.id = ?
        `, [id]
    )
    return rows[0]
}

export async function updateOrder({
    id,
    id_user,
    id_paket,
    id_pembayaran,
    kode_bayar,
    kode_voucher,
    tanggal_beli,
    tanggal_bayar
}) {
    const [result] = await pool.query(`
        UPDATE orders SET
            id_user = ?,
            id_paket = ?,
            id_pembayaran = ?,
            kode_bayar = ?,
            kode_voucher = ?,
            tanggal_beli = ?,
            tanggal_bayar = ?
        WHERE id = ?
        `, [
        id_user,
        id_paket,
        id_pembayaran,
        kode_bayar,
        kode_voucher,
        tanggal_beli,
        tanggal_bayar,
        id
    ])

    return await getOrder({ id })
}

export async function deleteOrder({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM orders
        WHERE id = ?
        `, [id])

    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Order not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}