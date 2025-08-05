import * as os from "../services/orderService.js";

export async function addOrder(req, res) {
    const {
        id_user,
        id_paket,
        id_pembayaran,
        kode_bayar,
        kode_voucher,
        tanggal_beli,
        tanggal_bayar
    } = req.body

    try {
        const order = await os.addOrder({
            id_user,
            id_paket,
            id_pembayaran,
            kode_bayar,
            kode_voucher,
            tanggal_beli,
            tanggal_bayar
        })

        res.status(201).json({ message: "Order created successfully", order });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getOrders(req, res) {
    const order = await os.getOrders()
    res.send(order)
}

export async function getOrder(req, res) {
    const id = req.params.id
    const order = await os.getOrder({ id })
    res.send(order)
}

export async function updateOrder(req, res) {
    const { id } = req.params;
    const {
        id_user,
        id_paket,
        id_pembayaran,
        kode_bayar,
        kode_voucher,
        tanggal_beli,
        tanggal_bayar
    } = req.body

    try {
        const order = await os.updateOrder({
            id,
            id_user,
            id_paket,
            id_pembayaran,
            kode_bayar,
            kode_voucher,
            tanggal_beli,
            tanggal_bayar
        })
        res.status(200).json({ message: "Order updated", order });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteOrder(req, res) {
    const { id } = req.params
    try {
        const order = await os.deleteOrder({ id })
        res.status(200).json({ message: "Order deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}