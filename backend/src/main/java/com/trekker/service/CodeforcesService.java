package com.trekker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trekker.dto.PlatformStats;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashSet;
import java.util.Set;

@Service
public class CodeforcesService {

    private static final String CF_USER_INFO_URL = "https://codeforces.com/api/user.info";
    private static final String CF_USER_STATUS_URL = "https://codeforces.com/api/user.status";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public CodeforcesService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public PlatformStats fetchStats(String username) {
        try {
            HttpRequest infoRequest = HttpRequest.newBuilder()
                    .uri(URI.create(CF_USER_INFO_URL + "?handles=" + username))
                    .GET()
                    .build();

            HttpResponse<String> infoResponse = httpClient.send(infoRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode infoRoot = objectMapper.readTree(infoResponse.body());

            if (!"OK".equals(infoRoot.get("status").asText())) {
                throw new RuntimeException("Codeforces API error for user: " + username);
            }

            JsonNode userInfo = infoRoot.get("result").get(0);
            int rating = 0;
            if (userInfo.has("rating") && !userInfo.get("rating").isNull()) {
                rating = userInfo.get("rating").asInt();
            }

            HttpRequest statusRequest = HttpRequest.newBuilder()
                    .uri(URI.create(CF_USER_STATUS_URL + "?handle=" + username))
                    .GET()
                    .build();

            HttpResponse<String> statusResponse = httpClient.send(statusRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode statusRoot = objectMapper.readTree(statusResponse.body());

            if (!"OK".equals(statusRoot.get("status").asText())) {
                throw new RuntimeException("Codeforces status API error for user: " + username);
            }

            JsonNode submissions = statusRoot.get("result");
            Set<String> solvedProblems = new HashSet<>();
            int easySolved = 0;
            int mediumSolved = 0;
            int hardSolved = 0;

            for (int i = 0; i < submissions.size(); i++) {
                JsonNode sub = submissions.get(i);
                if ("OK".equals(sub.get("verdict").asText())) {
                    JsonNode problem = sub.get("problem");
                    String problemId = problem.get("contestId").asText() + "-" + problem.get("index").asText();
                    if (!solvedProblems.contains(problemId)) {
                        solvedProblems.add(problemId);
                        int probRating = 1000;
                        if (problem.has("rating") && !problem.get("rating").isNull()) {
                            probRating = problem.get("rating").asInt();
                        }
                        if (probRating <= 1200) {
                            easySolved++;
                        } else if (probRating <= 1800) {
                            mediumSolved++;
                        } else {
                            hardSolved++;
                        }
                    }
                }
            }

            PlatformStats stats = new PlatformStats();
            stats.setUsername(username);
            stats.setEasySolved(easySolved);
            stats.setMediumSolved(mediumSolved);
            stats.setHardSolved(hardSolved);
            stats.setTotalSolved(solvedProblems.size());
            stats.setRating(rating);
            return stats;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Codeforces stats for " + username, e);
        }
    }
}
