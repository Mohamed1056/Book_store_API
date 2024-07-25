import { Router } from "express";
import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import authnicatToken from './userauth.js'

const router = Router();

//signUp
router.post("/sign-up", async(req, res) => {
    try {
        console.log("Request Body: ", req.body);
        const { username, email, password, address } = req.body;
        
        //check username length
        if (username.length < 4){
            return res
            .status(400)
            .json({ message: "User length should be greater than 3" })
        }

        //check if the user already exists or not
        const DoesTheUserExists = await User.findOne({ username: username });
        if (DoesTheUserExists){
            return res
            .status(400)
            .json({ message: "User name already exists" });  
        }

        //check if email already exists
        const DoesTheEmailExists = await User.findOne({ email: email });
        if (DoesTheEmailExists){
            return res
            .status(400)
            .json({ message: "Email already exists" });  
        }

        //check the password length
        if (password.length <= 5){
            return res
            .status(400)
            .json({ message: "Password should be greater than 5" })  ;
        }
        //creating hash password
        const hashPassword = await bcrypt.hash(password, 10);
        

        //creating the user with the above data
        const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
            address: address,
        });

        await newUser.save();
        return res.status(200).json({ message: 'SignUp successfully' });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//signIn
router.post("/sign-in", async(req, res) => {
    try {
        const { username, password } = req.body;
        //check if the username exist or not
        const DoesTheUserNameExist = await User.findOne({ username });
        if(!DoesTheUserNameExist){
            res.status(500).json({ message: "The user does not exist in our database!" });
        }
        //check if the password is correct
        await bcrypt.compare(password, DoesTheUserNameExist.password, (err, data) => {
            if (data){
                const authClaims = [
                    { name: DoesTheUserNameExist.username },
                    { role: DoesTheUserNameExist.role },
                ];

                const token = jsonwebtoken.sign({ authClaims }, "bookstore123", { expiresIn: "30d" });

                res.status(200).json({ id: DoesTheUserNameExist._id, role: DoesTheUserNameExist.role , token: token });
            } else {
                res.status(400).json({ message: "Invalid password" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//get user information
router.get("/get-user-information", authnicatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id);
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//update address
router.put("/update-address", authnicatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address});
        return res.status(200).json({ message: `Your address is updated to ${address}`});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;