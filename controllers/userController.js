import * as us from "../services/userService.js";

export async function addUser(req, res) {
    const { username, email, password: plainPassword } = req.body;

    try {
        const user = await us.addUser({ username, email, plainPassword });
        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getUsers(req, res) {
    const user = await us.getUsers();
    res.status(200).send(user);
}

export async function getUser(req, res) {
    const { id } = req.params;
    const user = await us.getUser({ id });
    res.status(200).send(user);
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { username, password: plainPassword } = req.body;

    try {
        const user = await us.updateUser({ id, username, plainPassword });
        res.status(200).json({ message: "User updated", user });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await us.deleteUser({ id });
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}