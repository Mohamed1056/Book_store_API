import { Router } from 'express';
import User from '../models/users.js';
import authnicatToken from './userauth.js';
import Book from '../models/book.js';

const router = Router();

//add book to favourite
router.put("/add-book-to-favourite", authnicatToken, async(req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const IsBookInFavourite = userData.favourites.includes(bookid);

        if (IsBookInFavourite){
            return res.status(200).json({ message: "The book is already in favourites!" });
        }
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid}});
        return res.status(200).json({ message: "The book is added to the favourites"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//delete book from favourite
router.delete("/delete-book-from-favourite", authnicatToken, async(req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const IsBookInFavourite = userData.favourites.includes(bookid);

        if (IsBookInFavourite){
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
            return res.status(200).json({ message: "The book is removed from the favourites"});
        }
        return res.status(200).json({ message: "The book is not in the favourites"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get favourite books for a particular user
router.get("/get-favourite-books", authnicatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const theFavs = userData.favourites;
        return res.json({
            status: "success",
            fav_books: theFavs,
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;