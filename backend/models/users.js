import mongoose from "mongoose";

const user = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://images.app.goo.gl/WB5ZfHPcM3WU3oF19.png",
    },
    role:{
        type: String,
        default: 'user',
        enum: ['admin', 'user'],
    },
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        }
    ],
}, {timestamps : true}
);

const User = mongoose.model("user", user);
export default User;