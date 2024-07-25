import { Router } from "express";
import User from '../models/users.js';
import jsonwebtoken from 'jsonwebtoken';
import authnicatToken from './userauth.js'
import Book from '../models/book.js';

const router = Router();

//add books for admin
router.post("/add-book", authnicatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin"){
            return res.status(400).json({ message: "You are not allowed to do the admin work!" });
        }
        const { url, title, author, price, desc, language } = req.body;
        const newbook = new Book({
            url: url,
            title: title,
            author: author,
            price: price,
            desc: desc,
            language: language,
        });
        await newbook.save();
        return res.status(200).json({ message: `The book ${title} is added to our database`});
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update book
router.put("/update-book", authnicatToken, async(req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        return res.status(200).json({ message: "The book updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//delete book
router.delete("/delete-book", authnicatToken, async(req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: 'book deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get all books
router.get("/get-all-books", authnicatToken, async(req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get recentely added books limit 4
router.get("/get-recent-books", authnicatToken, async(req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get books by id
router.get("/get-book-by-id/:id", authnicatToken, async(req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: book,
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})
export default router;