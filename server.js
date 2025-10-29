const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (in-memory for testing)
async function connectDB() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('Using in-memory MongoDB for testing');

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB connection error:', err);
  }
}

connectDB();

// Seed database with sample rooms
async function seedDatabase() {
  try {
    const Room = require('./models/Room');
    const existingRooms = await Room.find();
    if (existingRooms.length === 0) {
      const sampleRooms = [
        {
          roomNumber: '101',
          type: 'Single AC',
          price: 1200,
          available: true,
          description: 'Premium single AC room with attached bathroom, study table, and 24/7 power backup.'
        },
        {
          roomNumber: '102',
          type: 'Single Non-AC',
          price: 800,
          available: true,
          description: 'Comfortable single non-AC room with fan, study area, and shared bathroom facilities.'
        },
        {
          roomNumber: '103',
          type: 'Double AC',
          price: 1800,
          available: true,
          description: 'Spacious double AC room perfect for friends, with two study tables and attached bathrooms.'
        },
        {
          roomNumber: '104',
          type: 'Double Non-AC',
          price: 1200,
          available: true,
          description: 'Budget-friendly double non-AC room with fans, study areas, and shared facilities.'
        },
        {
          roomNumber: '105',
          type: 'Single AC',
          price: 1400,
          available: false,
          description: 'Executive single AC room with premium amenities, refrigerator, and laundry service.'
        },
        {
          roomNumber: '106',
          type: 'Double AC',
          price: 2000,
          available: true,
          description: 'Luxury double AC room with balcony, microwave, and housekeeping services.'
        }
      ];
      await Room.insertMany(sampleRooms);
      console.log('Sample rooms seeded');
    }
  } catch (err) {
    console.log('Seeding error:', err);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/profile', require('./routes/profile'));

// Seed after connection
setTimeout(seedDatabase, 15000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
