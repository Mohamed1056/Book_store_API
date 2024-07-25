import { Timestamp } from "bson";
import mongoose from "mongoose";

const order = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "book",
    },
    status: {
        type: String,
        default: "Order placed",
        enum: ['Order placed', 'Order delivered', 'Canceled', 'Delivered'],
    },
}, {timestamps : true},
);

const Order = mongoose.model("order", order);
export default Order;