package com.trekker.service;

import com.trekker.dto.PlatformStats;
import com.trekker.dto.StatsResponse;
import com.trekker.model.UserStats;
import com.trekker.repository.UserStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StatsAggregatorService {

    private static final long CACHE_THRESHOLD = 60 * 60 * 1000;

    @Autowired(required = false)
    private UserStatsRepository userStatsRepository;

    @Autowired
    private LeetCodeService leetCodeService;

    @Autowired
    private CodeforcesService codeforcesService;

    @Autowired
    private GfgService gfgService;

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public StatsResponse getStats(String leetcodeUsername, String codeforcesUsername, String gfgUsername) {
        String compositeUserId = "lc:" + (leetcodeUsername != null ? leetcodeUsername : "")
                + "-cf:" + (codeforcesUsername != null ? codeforcesUsername : "")
                + "-gfg:" + (gfgUsername != null ? gfgUsername : "");

        CacheEntry cached = cache.get(compositeUserId);
        if (cached != null && (System.currentTimeMillis() - cached.timestamp < CACHE_THRESHOLD)) {
            return cached.response;
        }

        if (userStatsRepository != null) {
            try {
                UserStats existing = userStatsRepository.findByUserId(compositeUserId).orElse(null);
                if (existing != null) {
                    long age = new Date().getTime() - existing.getLastUpdated().getTime();
                    if (age < CACHE_THRESHOLD) {
                        StatsResponse response = toResponse(existing);
                        cache.put(compositeUserId, new CacheEntry(response, System.currentTimeMillis()));
                        return response;
                    }
                }
            } catch (Exception ignored) {
            }
        }

        CompletableFuture<PlatformStats> leetcodeFuture = (leetcodeUsername != null && !leetcodeUsername.isEmpty())
                ? CompletableFuture.supplyAsync(() -> leetCodeService.fetchStats(leetcodeUsername))
                : CompletableFuture.completedFuture(null);

        CompletableFuture<PlatformStats> codeforcesFuture = (codeforcesUsername != null && !codeforcesUsername.isEmpty())
                ? CompletableFuture.supplyAsync(() -> codeforcesService.fetchStats(codeforcesUsername))
                : CompletableFuture.completedFuture(null);

        CompletableFuture<PlatformStats> gfgFuture = (gfgUsername != null && !gfgUsername.isEmpty())
                ? CompletableFuture.supplyAsync(() -> gfgService.fetchStats(gfgUsername))
                : CompletableFuture.completedFuture(null);

        PlatformStats leetcodeStats = safeGet(leetcodeFuture);
        PlatformStats codeforcesStats = safeGet(codeforcesFuture);
        PlatformStats gfgStats = safeGet(gfgFuture);

        Date now = new Date();
        StatsResponse response = new StatsResponse();
        response.setUserId(compositeUserId);
        response.setLastUpdated(now);
        response.setLeetcode(leetcodeStats);
        response.setCodeforces(codeforcesStats);
        response.setGeeksforgeeks(gfgStats);

        if (userStatsRepository != null) {
            try {
                UserStats entity = userStatsRepository.findByUserId(compositeUserId).orElse(new UserStats());
                entity.setUserId(compositeUserId);
                entity.setLeetcode(leetcodeStats);
                entity.setCodeforces(codeforcesStats);
                entity.setGeeksforgeeks(gfgStats);
                entity.setLastUpdated(now);
                if (entity.getCreatedAt() == null) {
                    entity.setCreatedAt(now);
                }
                entity.setUpdatedAt(now);
                UserStats saved = userStatsRepository.save(entity);
                response = toResponse(saved);
            } catch (Exception ignored) {
            }
        }

        response.setCreatedAt(response.getCreatedAt() != null ? response.getCreatedAt() : now);
        response.setUpdatedAt(response.getUpdatedAt() != null ? response.getUpdatedAt() : now);

        cache.put(compositeUserId, new CacheEntry(response, System.currentTimeMillis()));
        return response;
    }

    private PlatformStats safeGet(CompletableFuture<PlatformStats> future) {
        try {
            return future.join();
        } catch (Exception e) {
            return null;
        }
    }

    private StatsResponse toResponse(UserStats entity) {
        StatsResponse response = new StatsResponse();
        response.setId(entity.getId());
        response.setUserId(entity.getUserId());
        response.setLeetcode(entity.getLeetcode());
        response.setCodeforces(entity.getCodeforces());
        response.setGeeksforgeeks(entity.getGeeksforgeeks());
        response.setLastUpdated(entity.getLastUpdated());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    private static class CacheEntry {
        StatsResponse response;
        long timestamp;

        CacheEntry(StatsResponse response, long timestamp) {
            this.response = response;
            this.timestamp = timestamp;
        }
    }
}
