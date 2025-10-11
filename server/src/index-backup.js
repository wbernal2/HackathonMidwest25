const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./config/database');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to generate room codes
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to ensure unique room code
const generateUniqueRoomCode = async (db) => {
  const roomsCollection = db.collection('rooms');
  let roomCode;
  let isUnique = false;
  
  while (!isUnique) {
    roomCode = generateRoomCode();
    const existingRoom = await roomsCollection.findOne({ roomCode });
    if (!existingRoom) {
      isUnique = true;
    }
  }
  
  return roomCode;
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'HangHub Server is running!' });
});

/**
 * CREATE ROOM
 * POST /api/rooms
 * Body: { hangoutName, location, date, time, groupSize, hostName }
 */
app.post('/api/rooms', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const { hangoutName, location, date, time, groupSize, hostName } = req.body;
    
    // Validation
    if (!hangoutName || !location || !hostName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: hangoutName, location, hostName'
      });
    }
    
    // Generate unique room code
    const roomCode = await generateUniqueRoomCode(db);
    
    // Create room document
    const room = {
      roomCode,
      hangoutName,
      location,
      date: date ? new Date(date) : null,
      time: time ? new Date(time) : null,
      groupSize: parseInt(groupSize) || 4,
      hostName,
      status: 'waiting', // waiting, preferences, swiping, completed
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [
        {
          id: new ObjectId().toString(),
          name: hostName,
          isHost: true,
          status: 'ready', // ready, joining, preferences, swiping, completed
          joinedAt: new Date(),
          preferences: null,
          swipedActivities: []
        }
      ],
      preferences: {
        maxDistance: [],
        budget: [],
        drivingWillingness: [],
        groupSize: [],
        timeFlexibility: []
      },
      activities: {
        liked: [],
        passed: [],
        matches: []
      }
    };
    
    const result = await roomsCollection.insertOne(room);
    
    res.json({
      success: true,
      message: 'Room created successfully',
      roomCode,
      roomId: result.insertedId
    });
    
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
});

/**
 * JOIN ROOM
 * POST /api/rooms/:roomCode/join
 * Body: { userName }
 */
app.post('/api/rooms/:roomCode/join', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const { roomCode } = req.params;
    const { userName } = req.body;
    
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: 'userName is required'
      });
    }
    
    // Find room
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if user already in room
    const existingParticipant = room.participants.find(p => p.name === userName);
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'User already in room'
      });
    }
    
    // Add participant
    const newParticipant = {
      id: new ObjectId().toString(),
      name: userName,
      isHost: false,
      status: 'joining',
      joinedAt: new Date(),
      preferences: null,
      swipedActivities: []
    };
    
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase() },
      {
        $push: { participants: newParticipant },
        $set: { updatedAt: new Date() }
      }
    );
    
    res.json({
      success: true,
      message: 'Successfully joined room',
      participant: newParticipant
    });
    
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join room',
      error: error.message
    });
  }
});

/**
 * GET ROOM INFO
 * GET /api/rooms/:roomCode
 */
app.get('/api/rooms/:roomCode', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const { roomCode } = req.params;
    const room = await roomsCollection.findOne({ roomCode: roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      room
    });
    
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room',
      error: error.message
    });
  }
});

/**
 * UPDATE PARTICIPANT PREFERENCES
 * PUT /api/rooms/:roomCode/participants/:participantId/preferences
 * Body: { maxDistance, budget, drivingWillingness, groupSize, timeFlexibility }
 */
app.put('/api/rooms/:roomCode/participants/:participantId/preferences', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const { roomCode, participantId } = req.params;
    const preferences = req.body;
    
    // Update participant preferences
    const result = await roomsCollection.updateOne(
      { 
        roomCode: roomCode.toUpperCase(),
        'participants.id': participantId
      },
      {
        $set: {
          'participants.$.preferences': preferences,
          'participants.$.status': 'ready',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room or participant not found'
      });
    }
    
    // Add to room-wide preferences for statistics
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase() },
      {
        $push: {
          'preferences.maxDistance': preferences.maxDistance,
          'preferences.budget': preferences.budget,
          'preferences.drivingWillingness': preferences.drivingWillingness,
          'preferences.groupSize': preferences.groupSize,
          'preferences.timeFlexibility': preferences.timeFlexibility
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

/**
 * SUBMIT ACTIVITY SWIPES
 * POST /api/rooms/:roomCode/participants/:participantId/swipes
 * Body: { likedActivities, passedActivities }
 */
app.post('/api/rooms/:roomCode/participants/:participantId/swipes', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const { roomCode, participantId } = req.params;
    const { likedActivities, passedActivities } = req.body;
    
    // Update participant swipes
    await roomsCollection.updateOne(
      { 
        roomCode: roomCode.toUpperCase(),
        'participants.id': participantId
      },
      {
        $set: {
          'participants.$.swipedActivities': [...likedActivities, ...passedActivities],
          'participants.$.status': 'completed',
          updatedAt: new Date()
        }
      }
    );
    
    // Add to room-wide activity tracking
    await roomsCollection.updateOne(
      { roomCode: roomCode.toUpperCase() },
      {
        $push: {
          'activities.liked': { $each: likedActivities },
          'activities.passed': { $each: passedActivities }
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Swipes submitted successfully'
    });
    
  } catch (error) {
    console.error('Error submitting swipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit swipes',
      error: error.message
    });
  }
});

/**
 * GET ROOM STATISTICS
 * GET /api/rooms/:roomCode/stats
 */
app.get('/api/rooms/:roomCode/stats', async (req, res) => {
  try {
    const db = getDB();
    const roomsCollection = db.collection('rooms');
    
    const room = await roomsCollection.findOne({ roomCode: req.params.roomCode.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Calculate statistics
    const stats = {
      participantCount: room.participants.length,
      completedParticipants: room.participants.filter(p => p.status === 'completed').length,
      averagePreferences: {
        maxDistance: room.preferences.maxDistance.length > 0 
          ? room.preferences.maxDistance.reduce((a, b) => a + b, 0) / room.preferences.maxDistance.length 
          : 0,
        budget: room.preferences.budget.length > 0 
          ? room.preferences.budget.reduce((a, b) => a + b, 0) / room.preferences.budget.length 
          : 0,
        drivingWillingness: room.preferences.drivingWillingness.length > 0 
          ? room.preferences.drivingWillingness.reduce((a, b) => a + b, 0) / room.preferences.drivingWillingness.length 
          : 0,
        groupSize: room.preferences.groupSize.length > 0 
          ? room.preferences.groupSize.reduce((a, b) => a + b, 0) / room.preferences.groupSize.length 
          : 0,
        timeFlexibility: room.preferences.timeFlexibility.length > 0 
          ? room.preferences.timeFlexibility.reduce((a, b) => a + b, 0) / room.preferences.timeFlexibility.length 
          : 0
      },
      activityStats: {
        totalLikes: room.activities.liked.length,
        totalPasses: room.activities.passed.length,
        popularActivities: {} // TODO: Calculate most liked activities
      }
    };
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 HangHub Server is running on port ${PORT}`);
      console.log(`📱 Local: http://localhost:${PORT}`);
      console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
      console.log(`🍃 MongoDB connected and ready!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();