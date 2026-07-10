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

        const bodyText = $('body').text().replace(/\s+/g, ' ');

        const totalMatch = bodyText.match(/Problems Solved[\s:()]*(\d+)/i);
        if (totalMatch) totalSolved = parseInt(totalMatch[1]);

        const extractDifficulty = (level) => {
            const regexStr = `${level}[\\s:]*\\(?(\\d+)\\)?`;
            const match = bodyText.match(new RegExp(regexStr, 'i'));
            return match ? parseInt(match[1]) : 0;
        }

        easySolved = extractDifficulty('Easy');
        mediumSolved = extractDifficulty('Medium');
        hardSolved = extractDifficulty('Hard');

        const scoreMatch = bodyText.match(/Coding Score[\s:]*(\d+)/i);
        if (scoreMatch) rating = parseInt(scoreMatch[1]);

        if (totalSolved === 0 && easySolved === 0) {
            const scriptMatch = html.match(/id="__NEXT_DATA__"[^>]*>({.*})<\/script>/is);
            if (scriptMatch) {
                try {
                    const data = JSON.parse(scriptMatch[1]);
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
