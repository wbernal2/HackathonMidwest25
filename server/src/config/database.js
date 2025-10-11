const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client;
let db;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Set the default database (you can change this to your preferred database name)
    db = client.db("hackathon_db");
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
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