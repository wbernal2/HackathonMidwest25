const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client;
let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("MongoDB connection error: MONGODB_URI is not set.\n"
        + "Create a .env file in the server folder with MONGODB_URI or set the environment variable.\n"
        + "See server/.env.example for the expected format.");
      process.exit(1);
    }

    // Basic sanity check — let mongodb driver parse it and provide useful errors if invalid
    try {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    } catch (innerErr) {
      console.error('Invalid MONGODB_URI format:', innerErr.message);
      process.exit(1);
    }

    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Set the default database (you can change this to your preferred database name)
    db = client.db("hackathon_db");

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error && error.message ? error.message : error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const getClient = () => {
  if (!client) {
    throw new Error('Database client not initialized. Call connectDB first.');
  }
  return client;
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, getClient, closeConnection };