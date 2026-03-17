import UserStats from '../models/UserStats.js';
import { fetchLeetCodeStats } from '../services/leetcodeService.js';
import { fetchCodeforcesStats } from '../services/codeforcesService.js';
import { fetchGeeksForGeeksStats } from '../services/gfgService.js';
import mongoose from 'mongoose';

// Cache threshold in milliseconds (e.g., 1 hour)
const CACHE_THRESHOLD = 60 * 60 * 1000; 

export const getUserStats = async (req, res) => {
    try {
        const { leetcodeUsername, codeforcesUsername, gfgUsername } = req.body;

        if (!leetcodeUsername && !codeforcesUsername && !gfgUsername) {
            return res.status(400).json({ error: 'Must provide at least one platform username' });
        }

        // Generate a composite ID for this specific combination of handles
        const compositeUserId = `lc:${leetcodeUsername || ''}-cf:${codeforcesUsername || ''}-gfg:${gfgUsername || ''}`;

        // 1. Check if we have recent cached stats in MongoDB
        let existingUser = null;
        if (mongoose.connection.readyState === 1) {
            try {
                existingUser = await UserStats.findOne({ userId: compositeUserId });
            } catch (err) {
                console.warn("Database lookup failed, bypassing cache.");
            }
        }
        
        const now = new Date();
        const isDataFresh = existingUser && (now - existingUser.lastUpdated < CACHE_THRESHOLD);

        if (isDataFresh) {
            console.log("Serving cached data for", compositeUserId);
            return res.status(200).json(existingUser);
        }

        console.log("Fetching fresh data from platforms for", compositeUserId);

        // 2. Fetch data concurrently
        const fetchPromises = [];
        
        if (leetcodeUsername) {
            fetchPromises.push(fetchLeetCodeStats(leetcodeUsername).then(data => ({ platform: 'leetcode', data })));
        }
        if (codeforcesUsername) {
             fetchPromises.push(fetchCodeforcesStats(codeforcesUsername).then(data => ({ platform: 'codeforces', data })));
        }
        if (gfgUsername) {
             fetchPromises.push(fetchGeeksForGeeksStats(gfgUsername).then(data => ({ platform: 'geeksforgeeks', data })));
        }

        // Execute all requests. Promise.allSettled avoids one failed request breaking the others
        const results = await Promise.allSettled(fetchPromises);
        
        const newStatsData = {
            userId: compositeUserId,
            lastUpdated: now
        };

        results.forEach(result => {
             if (result.status === 'fulfilled') {
                 const { platform, data } = result.value;
                 newStatsData[platform] = data;
             } else {
                 console.error(`Failed to fetch for a platform:`, result.reason);
             }
        });

        // 3. Save to MongoDB (Upsert) if connected
        if (mongoose.connection.readyState === 1) {
            try {
                const savedStats = await UserStats.findOneAndUpdate(
                    { userId: compositeUserId },
                    { $set: newStatsData },
                    { new: true, upsert: true }
                );
                return res.status(200).json(savedStats);
            } catch (err) {
                console.warn("Database save failed, returning un-cached data.");
            }
        }

        // Fallback if DB is not connected
        res.status(200).json(newStatsData);

    } catch (error) {
        console.error("Error in getUserStats Controller:", error);
        res.status(500).json({ error: 'Failed to aggregate user stats' });
    }
};
