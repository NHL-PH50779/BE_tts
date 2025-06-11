import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose
      .connect(
        // "mongodb+srv://quanglt22:quang2204@cluster0.4czbvw0.mongodb.net/products"
        "mongodb+srv://lamnhph50779:jpWw7P8hfZdN1xOk@cluster0.620msmt.mongodb.net/CodeFarm"
      )
      .then();
  } catch (error) {
    console.log(error);
  }
};
