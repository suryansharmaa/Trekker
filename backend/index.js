import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn("MONGODB_URI is not defined in .env! Cannot connect to database.");
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
             serverSelectionTimeoutMS: 5000 // Timeout quickly if MongoDB isn't running locally
        });
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB connection error (Caching is disabled):', error.message);
        // We will not exit the process, allowing the API to gracefully fetch live data
    }
};

// Start Server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
