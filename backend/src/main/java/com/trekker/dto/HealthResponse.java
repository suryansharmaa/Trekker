package com.trekker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthResponse {

    private String status;
    private String message;

    public HealthResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }
}
