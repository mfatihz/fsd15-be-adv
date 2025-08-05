import * as pms from "../services/paymentMethodService.js";

export async function addPayment(req, res) {
    const {
        metode_bayar,
        biaya_admin
    } = req.body

    try {
        const pembayaran = await pms.addPayment({
            metode_bayar,
            biaya_admin
        })
        res.status(201).json({ message: "Payment method created successfully", pembayaran });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getPayments(req, res) {
    const pembayaran = await pms.getPayments()
    res.send(pembayaran)
}

export async function getPayment(req, res) {
    const { id } = req.params
    const pembayaran = await pms.getPayment({ id })
    res.send(pembayaran)
}

export async function updatePayment(req, res) {
    const { id } = req.params;
    const {
        metode_bayar,
        biaya_admin
    } = req.body

    try {
        const pembayaran = await pms.updatePayment({
            id,
            metode_bayar,
            biaya_admin
        })
        res.status(200).json({ message: "Payment method updated", pembayaran });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deletePayment(req, res) {
    const { id } = req.params

    try {
        const pembayaran = await pms.deletePayment({ id })
        res.status(200).json({ message: "Payment method deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}