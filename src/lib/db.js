import mongoose from "mongoose";

let connection = {}

export const connectDb = async () => {
  try {
    if (connection.isConnected) {
      console.log('Already connected to database');
      return;
    }
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = dbConnection.connections[0].readyState;
    console.log('DB Connected Successfully');

  } catch (error) {
    console.log('Database connection Failed: ', error);
    process.exit(1);
  }
}