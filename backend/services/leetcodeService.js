import axios from 'axios';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

export const fetchLeetCodeStats = async (username) => {
    const query = `
    query getUserProfile($username: String!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }
    `;

    try {
        const response = await axios.post(LEETCODE_API_ENDPOINT, {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        if (response.data.errors) {
            throw new Error(`Leetcode user not found or private profile: ${username}`);
        }

        const data = response.data.data;
        if (!data || !data.matchedUser) {
           throw new Error(`User ${username} not found on LeetCode.`);
        }

        const submissions = data.matchedUser.submitStats.acSubmissionNum;
        
        let easySolved = 0, mediumSolved = 0, hardSolved = 0, totalSolved = 0;

        submissions.forEach(sub => {
            if (sub.difficulty === "Easy") easySolved = sub.count;
            if (sub.difficulty === "Medium") mediumSolved = sub.count;
            if (sub.difficulty === "Hard") hardSolved = sub.count;
            if (sub.difficulty === "All") totalSolved = sub.count;
        });

        return {
            username,
            easySolved,
            mediumSolved,
            hardSolved,
            totalSolved,
            rating: null
        };

    } catch (error) {
        throw error;
    }
};
