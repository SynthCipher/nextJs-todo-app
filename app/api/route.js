import ConnectDB from "@/lib/config/db"; // ✅ default export ke liye sahi hai
import TodoModel from "@/lib/models/TodoModel";

import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

export async function GET(request) {
  const todos = await TodoModel.find({});

  return NextResponse.json({ todos: todos });
}

export async function POST(request) {
  const { title, description } = await request.json();

  await TodoModel.create({
    title,
    description,
  });
  return NextResponse.json({ msg: "Todo Created" });
}

export async function DELETE(request) {
  const { id } = await request.json();
  console.log(id);
  await TodoModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Task Deleted" });
}

export async function PATCH(request) {
  const { id } = await request.json();
  console.log(id);
  console.log("HEllo");

  // await TodoModel.findByIdAndUpdate(id, { isCompleted: true });
  await TodoModel.findByIdAndUpdate(id, { $set: { isCompleted: true } });
  return NextResponse.json({ msg: "Task Completed" });
}
