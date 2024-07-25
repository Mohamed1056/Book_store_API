import { Router } from 'express';
import User from '../models/users.js';
import authnicatToken from './userauth.js';

const router = Router();

//put book to cart
router.put("/put-book-in-cart", authnicatToken, async(req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const IsBookInCart = userData.cart.includes(bookid);

        if (IsBookInCart){
            return res.status(200).json({ message: "The book is already in cart!" });
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
        return res.status(200).json({ message: "The book is added to the cart"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//remove from cart
router.delete("/remove-from-cart/:bookid", authnicatToken, async(req, res) => {
    try {
        const { bookid } = req.params;
        const { id } = req.headers;
        const userData = await User.findById(id);
        const DoesTheBookInCart = userData.cart.includes(bookid);

        if (DoesTheBookInCart){
            await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
            return res.status(200).json({ message: "The book is removed from cart!" });
        }
        return res.status(200).json({ message: "The book is not in cart!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get cart of a particular user
router.get("/get-user-cart", authnicatToken, async(req, res) => {
    const { id } = req.headers;
    const booksInCart = await User.findById(id).select("cart");
    return res.json({
        status: "success",
        data : booksInCart,
    })
});

export default router;