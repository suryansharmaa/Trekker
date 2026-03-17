import mongoose from 'mongoose';

const platformStatsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    easySolved: {
        type: Number,
        default: 0
    },
    mediumSolved: {
        type: Number,
        default: 0
    },
    hardSolved: {
        type: Number,
        default: 0
    },
    totalSolved: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: null // Some platforms might not have a rating
    }
}, { _id: false });


const userStatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // This could be the unified "handle" or email if authentication was added
    },
    leetcode: platformStatsSchema,
    codeforces: platformStatsSchema,
    geeksforgeeks: platformStatsSchema,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const UserStats = mongoose.model('UserStats', userStatsSchema);

export default UserStats;
