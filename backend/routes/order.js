import { Router } from 'express';
import User from '../models/users.js';
import authnicatToken from './userauth.js';
import Order from '../models/order.js';
import Book from '../models/book.js';

const router = Router();

//place order
router.post("/place-order", authnicatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        const theOrder = new Order({ user: id, order: order });
        await theOrder.save()
        //saving order in the user model
        await User.findByIdAndUpdate(id, { $push: { orders: theOrder._id }});
        //removing book from cart
        await User.findByIdAndUpdate(id, { $pull: { cart: {$in: order.books} }});
        return res.json({
            status: "success",
            message: "Order placed successfully!",
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get order history for a particular User
router.get("/get-order-history", authnicatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        })
        const oredrData = userData.orders.reverse();
        return res.json({
            status: "success",
            data: oredrData,
        });
    } catch (error) {
        return res.status(200).json({ message: "Internal server error" });
    }
});

//get all orders for admin only
router.get("/get-all-orders", authnicatToken, async(req, res) => {
    try {
        const userData = await Order.find()
        .populate({
            path: "book",
        })
        .populate({
            path: "user",
        })
        .sort({ createdAt: -1 });

        return res.json({
            status: "success",
            data: userData,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

//update order for admin only
router.put("/update-order/:id", authnicatToken, async(req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "success",
            message: "Updated successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})
export default router