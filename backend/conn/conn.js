import mongoose from "mongoose";

const connection = async () => {
    try{
        await mongoose.connect(process.env.URI);
        console.log('Connected to the database!');
    }catch(err){
        console.log(err);
    }
};

export default connection;