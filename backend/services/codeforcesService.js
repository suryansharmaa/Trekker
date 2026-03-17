import axios from 'axios';

const CF_API_USER_INFO = 'https://codeforces.com/api/user.info';
const CF_API_USER_STATUS = 'https://codeforces.com/api/user.status';

export const fetchCodeforcesStats = async (username) => {
    try {
        // Fetch User Info (for Rating)
        const infoResponse = await axios.get(`${CF_API_USER_INFO}?handles=${username}`);
        if (infoResponse.data.status !== 'OK') {
             throw new Error(`Codeforces Error: ${infoResponse.data.comment}`);
        }
        
        const userInfo = infoResponse.data.result[0];
        const rating = userInfo.rating || 0; // Unrated users might not have this field

        // Fetch User Status/Submissions to calculate solved problems
        // Note: CF doesn't cleanly categorize Easy/Medium/Hard by default in the API. 
        // We will approximate this based on Problem rating.
        // <=1200 : Easy
        // 1300-1800 : Medium
        // >1800 : Hard
        // We must also deduplicate accepted submissions.

        const statusResponse = await axios.get(`${CF_API_USER_STATUS}?handle=${username}`);
        if (statusResponse.data.status !== 'OK') {
            throw new Error(`Codeforces Error: ${statusResponse.data.comment}`);
        }

        const submissions = statusResponse.data.result;
        
        // Use a Set to track uniquely solved problems
        const solvedProblems = new Set();
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;

        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                     const probRating = sub.problem.rating || 1000; // default to easy if no rating exists
                     
                     if (probRating <= 1200) {
                         easySolved++;
                     } else if (probRating <= 1800) {
                         mediumSolved++;
                     } else {
                         hardSolved++;
                     }
                }
            }
        });

        return {
            username,
            easySolved,
            mediumSolved,
            hardSolved,
            totalSolved: solvedProblems.size,
            rating
        };

    } catch (error) {
        console.error(`Error fetching Codeforces stats for ${username}:`, error.message);
        throw error;
    }
};
