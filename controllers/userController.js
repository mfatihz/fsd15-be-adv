import * as us from "../services/userService.js";

export async function getUsers(req, res) {
    const user = await us.getUsers();
    res.status(200).send(user);
}

export async function getUser(req, res) {
    const id = req.userId;
    const user = await us.getUser({ id });
    return res.status(200).json({
        success: true,
        message: "Get User data successfully",
        data: user
    });
}

export async function updateUser(req, res) {
    const id = req.userId;
    const updates = req.body;

    try {
        const user = await us.updateUser({ id, updates });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteUser(req, res) {
    const id = req.userId;
    try {
        const user = await us.deleteUser({ id });
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}