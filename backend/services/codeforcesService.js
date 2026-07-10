import axios from 'axios';

const CF_API_USER_INFO = 'https://codeforces.com/api/user.info';
const CF_API_USER_STATUS = 'https://codeforces.com/api/user.status';

export const fetchCodeforcesStats = async (username) => {
    try {
        const infoResponse = await axios.get(`${CF_API_USER_INFO}?handles=${username}`);
        if (infoResponse.data.status !== 'OK') {
             throw new Error(`Codeforces Error: ${infoResponse.data.comment}`);
        }
        
        const userInfo = infoResponse.data.result[0];
        const rating = userInfo.rating || 0;

        const statusResponse = await axios.get(`${CF_API_USER_STATUS}?handle=${username}`);
        if (statusResponse.data.status !== 'OK') {
            throw new Error(`Codeforces Error: ${statusResponse.data.comment}`);
        }

        const submissions = statusResponse.data.result;
        const solvedProblems = new Set();
        
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;

        submissions.forEach(sub => {
            if (sub.verdict === 'OK') {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    const probRating = sub.problem.rating || 1000;
                     
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
        throw error;
    }
};
