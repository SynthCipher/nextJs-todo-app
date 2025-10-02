import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ConnectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL not set in environment variables");
  }
  await mongoose.connect(mongoUrl);
  console.log("DB CONNECTED");
};

export default ConnectDB;
