import * as mls from "../services/myListService.js";

export async function addToMyList(req, res) {
    const userId = req.userId;
    const { filmId } = req.body;
    try {
        const myList = await mls.addToMyList({ userId, filmId })
        return res.status(201).json({
            success: true,
            message: "MyList created successfully",
            data: myList
        });
    } catch (err) {
        return res.status( err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function getMyLists(req, res) {
    const myList = await mls.getMyLists()
    res.send(myList)
}

export async function getMyListFilms(req, res) {
    const userId = req.userId;

    const myList = await mls.getMyListFilms({ userId })
    res.send(myList)
}

export async function getMyListUsers(req, res) {
    const { id } = req.params;
    const myList = await mls.getMyListUsers({ id })
    res.send(myList)
}

export async function updateMyList(req, res) {
    const userId = req.userId;
    const { filmIds } = req.body;

    try {
        const myList = await mls.updateMyList({ userId, filmIds })
        return res.status(200).json({
            success: true,
            message: "MyList updated",
            data: myList
        });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status( err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function deleteFromMyList(req, res) {
    const userId = req.userId;
    const { filmId } = req.params;
    try {
        const myList = await mls.deleteFromMyList({ userId, filmId })
        return res.status(200).json({
            success: true,
            message: "Success delete Series/Film form MyList",
            data: filmId
        });
    } catch (err) {
        return res.status( err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}