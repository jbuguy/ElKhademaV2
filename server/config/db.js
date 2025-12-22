import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongo db");
    } catch (error) {
        console.log("error connecting to mongo db");
        console.error(error);
        process.exit(1);
    }
}
