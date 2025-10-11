const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test MongoDB connection and operations
app.get('/test-db', async (req, res) => {
  try {
    const db = getDB();
    
    // Test 1: List all collections
    const collections = await db.listCollections().toArray();
    
    // Test 2: Create a test document in a 'test' collection
    const testCollection = db.collection('test');
    const testDoc = {
      message: 'Hello MongoDB!',
      timestamp: new Date(),
      environment: 'development'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    
    // Test 3: Query the document we just created
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    
    // Test 4: Count documents in test collection
    const docCount = await testCollection.countDocuments();
    
    res.json({
      success: true,
      message: 'MongoDB connection and operations test successful!',
      results: {
        collections: collections.map(c => c.name),
        insertedDocument: foundDoc,
        documentCount: docCount,
        insertedId: insertResult.insertedId
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Get all documents from test collection
app.get('/test-data', async (req, res) => {
  try {
    const db = getDB();
    const testCollection = db.collection('test');
    const documents = await testCollection.find({}).toArray();
    
    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test data',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server - listen on all network interfaces
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Network: http://172.16.0.251:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();