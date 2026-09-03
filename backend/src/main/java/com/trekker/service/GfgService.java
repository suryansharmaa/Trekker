package com.trekker.service;

import com.trekker.dto.PlatformStats;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GfgService {

    private static final String GFG_PROFILE_URL = "https://www.geeksforgeeks.org/user/";

    public PlatformStats fetchStats(String username) {
        PlatformStats stats = new PlatformStats();
        stats.setUsername(username);
        stats.setEasySolved(0);
        stats.setMediumSolved(0);
        stats.setHardSolved(0);
        stats.setTotalSolved(0);
        stats.setRating(null);

        try {
            Document doc = Jsoup.connect(GFG_PROFILE_URL + username + "/")
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            String bodyText = doc.body().text().replaceAll("\\s+", " ");

            Pattern totalPattern = Pattern.compile("Problems Solved[\\s:()]*?(\\d+)", Pattern.CASE_INSENSITIVE);
            Matcher totalMatcher = totalPattern.matcher(bodyText);
            if (totalMatcher.find()) {
                stats.setTotalSolved(Integer.parseInt(totalMatcher.group(1)));
            }

            stats.setEasySolved(extractDifficulty(bodyText, "Easy"));
            stats.setMediumSolved(extractDifficulty(bodyText, "Medium"));
            stats.setHardSolved(extractDifficulty(bodyText, "Hard"));

            Pattern scorePattern = Pattern.compile("Coding Score[\\s:]*(\\d+)", Pattern.CASE_INSENSITIVE);
            Matcher scoreMatcher = scorePattern.matcher(bodyText);
            if (scoreMatcher.find()) {
                stats.setRating(Integer.parseInt(scoreMatcher.group(1)));
            }

        } catch (Exception e) {
            return stats;
        }

        return stats;
    }

    private int extractDifficulty(String text, String level) {
        Pattern pattern = Pattern.compile(level + "[\\s:]*\\(?(\\d+)\\)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }
}
