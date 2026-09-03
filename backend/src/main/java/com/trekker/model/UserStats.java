package com.trekker.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.trekker.dto.PlatformStats;
import java.util.Date;

@Getter
@Setter
@Document(collection = "userstats")
public class UserStats {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private PlatformStats leetcode;
    private PlatformStats codeforces;
    private PlatformStats geeksforgeeks;
    private Date lastUpdated;
    private Date createdAt;
    private Date updatedAt;
}
