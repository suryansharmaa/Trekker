package com.trekker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlatformStats {

    private String username;
    private int easySolved;
    private int mediumSolved;
    private int hardSolved;
    private int totalSolved;
    private Integer rating;
}
