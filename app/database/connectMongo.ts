import mongoose from "mongoose";

export default async function connectMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {dbName:'nextauth_db'})
  if (!db) throw new Error("Failed to connect to DataBase")
  return db
}
