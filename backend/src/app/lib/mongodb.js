import { MongoClient } from "mongodb";
const options = {};
let globalClientPromise;
export function getClientPromise() {
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("mongodb+srv://6511150_Sai:XASHS123a@cluster0.35zoe55.mongodb.net/?appName=Cluster0");
}
if (process.env.NODE_ENV === "development") {
  if (!globalClientPromise) {
    const client = new MongoClient(uri, options);
    globalClientPromise = client.connect();
  }
  return globalClientPromise;
}else {
  const client = new MongoClient(uri, options);
  return client.connect();
}
}