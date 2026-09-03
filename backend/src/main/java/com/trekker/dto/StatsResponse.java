package com.trekker.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class StatsResponse {

    private String id;
    private String userId;
    private PlatformStats leetcode;
    private PlatformStats codeforces;
    private PlatformStats geeksforgeeks;
    private Date lastUpdated;
    private Date createdAt;
    private Date updatedAt;
}
