import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://lamnhph50779:jpWw7P8hfZdN1xOk@cluster0.620msmt.mongodb.net/CodeFarm").then();
  } catch (error) {
    console.log(error);
  }
};
