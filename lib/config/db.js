import mongoose from "mongoose";

const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://onela:onela25@onela-nextjs-project.0jy6byy.mongodb.net/todo-app"
  );
  console.log("DB CONNECTED")
};

export default ConnectDB;
