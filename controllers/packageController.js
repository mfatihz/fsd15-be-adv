import * as ps from "../services/packageService.js";

export async function addPackage(req, res) {
    const {
        nama_paket,
        jumlah_akun,
        biaya_paket,
        keuntungan
    } = req.body

    try {
        const paket = await ps.addPackage({
            nama_paket,
            jumlah_akun,
            biaya_paket,
            keuntungan
        })
        res.status(201).json({ message: "Paket created successfully", paket });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getPackages(req, res) {
    const paket = await ps.getPackages()
    res.status(200).send(paket)
}

export async function getPackage(req, res) {
    const { id } = req.params
    const paket = await ps.getPackage({ id })
    res.status(200).send(paket)
}

export async function updatePackage(req, res) {
    const { id } = req.params;
    const {
        nama_paket,
        jumlah_akun,
        biaya_paket,
        keuntungan
    } = req.body

    try {
        const paket = await ps.updatePackage({
            id,
            nama_paket,
            jumlah_akun,
            biaya_paket,
            keuntungan
        })
        res.status(200).json({ message: "Paket updated", paket });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deletePackage(req, res) {
    const { id } = req.params
    try {
        const paket = await ps.deletePackage({ id })
        res.status(200).json({ message: "Paket deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}