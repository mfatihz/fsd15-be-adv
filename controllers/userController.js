import * as us from "../services/userService.js";

export async function getUsers(req, res) {
    const user = await us.getUsers();

    try {
        return res.status(200).json({
            success: true,
            message: "Get User data successfully",
            data: user
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function getUser(req, res) {
    const id = req.userId;

    try {
        const user = await us.getUser({ id });
        return res.status(200).json({
            success: true,
            message: "Get User data successfully",
            data: user
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
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
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function deleteUser(req, res) {
    const id = req.userId;
    try {
        await us.deleteUser({ id });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: id
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}