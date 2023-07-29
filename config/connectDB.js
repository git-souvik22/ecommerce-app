import mongoose from "mongoose";
import "colors";
const connectDB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB database ${connect.connection.host}`);
    } catch (error) {
        console.log(`${error}`.bgRed.white);
    }
}

export default connectDB;