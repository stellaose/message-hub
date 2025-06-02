import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_USER}.iatogay.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.CLUSTER_NAME}`;

const databaseConnection = {
  getConnect: () => {
    mongoose
      .connect(db)
      .then(() => console.log("Database Connected Successfully"));
  },
};

export default databaseConnection;
