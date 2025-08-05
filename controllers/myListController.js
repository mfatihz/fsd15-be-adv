import * as mls from "../services/myListService.js";

export async function addToMyList(req, res) {
    const { id: userId } = req.params;
    const { filmId } = req.body;
    try {
        const myList = await mls.addToMyList({ userId, filmId })
        res.status(201).json({ message: "MyList created successfully", myList });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getMyLists(req, res) {
    const myList = await mls.getMyLists()
    res.send(myList)
}

export async function getMyListFilms(req, res) {
    const { id } = req.params;
    const myList = await mls.getMyListFilms({ id })
    res.send(myList)
}

export async function getMyListUsers(req, res) {
    const { id } = req.params;
    const myList = await mls.getMyListUsers({ id })
    res.send(myList)
}

export async function updateMyList(req, res) {
    const { id: userId } = req.params;
    const { filmIds } = req.body;

    try {
        const myList = await mls.updateMyList({ userId, filmIds })
        res.status(200).json({ message: "MyList updated", myList });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteFromMyList(req, res) {
    const { id: userId, filmId } = req.params;
    try {
        const myList = await mls.deleteFromMyList({ userId, filmId })
        res.status(200).json({ message: "MyList deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}