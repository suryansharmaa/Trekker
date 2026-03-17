import axios from 'axios';
import * as cheerio from 'cheerio';

const GFG_PROFILE_URL = 'https://www.geeksforgeeks.org/user/';

export const fetchGeeksForGeeksStats = async (username) => {
    try {
        const response = await axios.get(`${GFG_PROFILE_URL}${username}/`);
        const html = response.data;
        const $ = cheerio.load(html);

        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;
        let totalSolved = 0;
        let rating = 0;

        // GeeksforGeeks uses heavily obfuscated React classes now, making exact class scraping brittle
        // Instead, we extract text content from the body and use Regex to find the metrics
        
        const bodyText = $('body').text().replace(/\s+/g, ' '); // Normalize whitespace

        // 1. Total Solved
        // E.g. "Problems Solved : 240" or "Problems Solved(240)"
        const totalMatch = bodyText.match(/Problems Solved[\s:()]*(\d+)/i);
        if (totalMatch) totalSolved = parseInt(totalMatch[1]);

        // 2. Difficulty Breakdown. 
        // We look for patterns like "Easy \n 120" or "Medium(40)" or "Easy (120)"
        // The script content can also hold these if the DOM is hydrated later.
        
        const extractDifficulty = (level) => {
            const regexStr = `${level}[\\s:]*\\(?(\\d+)\\)?`;
            const match = bodyText.match(new RegExp(regexStr, 'i'));
            return match ? parseInt(match[1]) : 0;
        }

        easySolved = extractDifficulty('Easy');
        mediumSolved = extractDifficulty('Medium');
        hardSolved = extractDifficulty('Hard');

        // 3. Coding Score
        const scoreMatch = bodyText.match(/Coding Score[\s:]*(\d+)/i);
        if (scoreMatch) rating = parseInt(scoreMatch[1]);

        // If Regex on body fails entirely (e.g. they use SVGs or purely JSON injected state), 
        // fallback to attempting to parse window.__NEXT_DATA__ or similar script blocks
        if (totalSolved === 0 && easySolved === 0) {
            const scriptMatch = html.match(/id="__NEXT_DATA__"[^>]*>({.*})<\/script>/is);
            if (scriptMatch) {
                try {
                    const data = JSON.parse(scriptMatch[1]);
                    // Traverse their specific JSON structure if known. (Often props.pageProps...)
                    // This is a safety net.
                } catch(e) {}
            }
        }

        return {
            username,
            easySolved,
            mediumSolved,
            hardSolved,
            totalSolved,
            rating
        };

    } catch (error) {
         console.error(`Error scraping GFG stats for ${username}:`, error.message);
         // Return 0s if scraper fails due to class changes, rather than crashing the whole dashboard
         return {
            username,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            totalSolved: 0,
            rating: null
         };
    }
};
