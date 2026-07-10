import UserStats from '../models/UserStats.js';
import { fetchLeetCodeStats } from '../services/leetcodeService.js';
import { fetchCodeforcesStats } from '../services/codeforcesService.js';
import { fetchGeeksForGeeksStats } from '../services/gfgService.js';
import mongoose from 'mongoose';

const CACHE_THRESHOLD = 60 * 60 * 1000; 

export const getUserStats = async (req, res) => {
    try {
        const { leetcodeUsername, codeforcesUsername, gfgUsername } = req.body;

        if (!leetcodeUsername && !codeforcesUsername && !gfgUsername) {
            return res.status(400).json({ error: 'Must provide at least one platform username' });
        }

        const compositeUserId = `lc:${leetcodeUsername || ''}-cf:${codeforcesUsername || ''}-gfg:${gfgUsername || ''}`;

        let existingUser = null;
        if (mongoose.connection.readyState === 1) {
            try {
                existingUser = await UserStats.findOne({ userId: compositeUserId });
            } catch (err) {}
        }
        
        const now = new Date();
        const isDataFresh = existingUser && (now - existingUser.lastUpdated < CACHE_THRESHOLD);

        if (isDataFresh) {
            return res.status(200).json(existingUser);
        }

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

        const results = await Promise.allSettled(fetchPromises);
        
        const newStatsData = {
            userId: compositeUserId,
            lastUpdated: now
        };

        results.forEach(result => {
             if (result.status === 'fulfilled') {
                 const { platform, data } = result.value;
                 newStatsData[platform] = data;
             }
        });

        if (mongoose.connection.readyState === 1) {
            try {
                const savedStats = await UserStats.findOneAndUpdate(
                    { userId: compositeUserId },
                    { $set: newStatsData },
                    { new: true, upsert: true }
                );
                return res.status(200).json(savedStats);
            } catch (err) {}
        }

        res.status(200).json(newStatsData);

    } catch (error) {
        res.status(500).json({ error: 'Failed to aggregate user stats' });
    }
};
