import mongoose from "mongoose";
export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("There is an error connecting to MongoDB:", error);
  }
};
