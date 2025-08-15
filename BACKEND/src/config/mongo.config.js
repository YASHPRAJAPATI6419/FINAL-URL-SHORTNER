import mongoose from "mongoose";

const connectDB =async()=>{
    try {
       const conn=await mongoose.connect(process.env.MONGO_URL);
       console.log(`mogodb connected:${conn.connection.host}`);

    } catch (error) {
       console.log(error.message); 
    }
}

export default connectDB; 