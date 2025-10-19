import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache =
  global.mongooseConnection ??
  (global.mongooseConnection = { conn: null, promise: null });

export async function connectDb() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGODB_URI);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default connectDb;
