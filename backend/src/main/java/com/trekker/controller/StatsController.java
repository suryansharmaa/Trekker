package com.trekker.controller;

import com.trekker.dto.ErrorResponse;
import com.trekker.dto.HealthResponse;
import com.trekker.dto.StatsRequest;
import com.trekker.dto.StatsResponse;
import com.trekker.service.StatsAggregatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StatsController {

    @Autowired
    private StatsAggregatorService statsAggregatorService;

    @PostMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestBody StatsRequest request) {
        if ((request.getLeetcodeUsername() == null || request.getLeetcodeUsername().isEmpty())
                && (request.getCodeforcesUsername() == null || request.getCodeforcesUsername().isEmpty())
                && (request.getGfgUsername() == null || request.getGfgUsername().isEmpty())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Must provide at least one platform username"));
        }

        try {
            StatsResponse response = statsAggregatorService.getStats(
                    request.getLeetcodeUsername(),
                    request.getCodeforcesUsername(),
                    request.getGfgUsername()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to aggregate user stats"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse("OK", "Backend is running"));
    }
}
