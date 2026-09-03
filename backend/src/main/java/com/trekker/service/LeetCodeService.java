package com.trekker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trekker.dto.PlatformStats;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class LeetCodeService {

    private static final String LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public LeetCodeService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public PlatformStats fetchStats(String username) {
        try {
            String query = "query getUserProfile($username: String!) { "
                    + "allQuestionsCount { difficulty count } "
                    + "matchedUser(username: $username) { "
                    + "submitStats { acSubmissionNum { difficulty count submissions } } } }";

            String requestBody = objectMapper.writeValueAsString(new GraphQLRequest(query, username));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(LEETCODE_GRAPHQL_URL))
                    .header("Content-Type", "application/json")
                    .header("Referer", "https://leetcode.com")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(response.body());

            if (root.has("errors")) {
                throw new RuntimeException("LeetCode user not found: " + username);
            }

            JsonNode matchedUser = root.path("data").path("matchedUser");
            if (matchedUser.isMissingNode() || matchedUser.isNull()) {
                throw new RuntimeException("User " + username + " not found on LeetCode");
            }

            JsonNode submissions = matchedUser.path("submitStats").path("acSubmissionNum");

            int easySolved = 0;
            int mediumSolved = 0;
            int hardSolved = 0;
            int totalSolved = 0;

            for (int i = 0; i < submissions.size(); i++) {
                JsonNode sub = submissions.get(i);
                String difficulty = sub.get("difficulty").asText();
                int count = sub.get("count").asInt();
                if (difficulty.equals("Easy")) {
                    easySolved = count;
                } else if (difficulty.equals("Medium")) {
                    mediumSolved = count;
                } else if (difficulty.equals("Hard")) {
                    hardSolved = count;
                } else if (difficulty.equals("All")) {
                    totalSolved = count;
                }
            }

            PlatformStats stats = new PlatformStats();
            stats.setUsername(username);
            stats.setEasySolved(easySolved);
            stats.setMediumSolved(mediumSolved);
            stats.setHardSolved(hardSolved);
            stats.setTotalSolved(totalSolved);
            stats.setRating(null);
            return stats;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch LeetCode stats for " + username, e);
        }
    }

    private static class GraphQLRequest {
        public String query;
        public Variables variables;

        public GraphQLRequest(String query, String username) {
            this.query = query;
            this.variables = new Variables(username);
        }

        private static class Variables {
            public String username;

            public Variables(String username) {
                this.username = username;
            }
        }
    }
}
