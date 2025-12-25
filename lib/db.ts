import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI!;

if (!MONGO_DB_URI) {
  throw new Error("Please define MONGO_DB_URI in Vercel env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_DB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
