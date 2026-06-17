package com.smkarupatti.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product description is required")
    private String description;

    @NotNull(message = "Price per kg is required")
    private Double pricePerKg;

    private String benefits; // Comma separated benefits string

    private String category; // Category string matching Product.Category enum name

    private Integer stock = 0;

    private Boolean isAvailable = true;

    private Boolean isFeatured = false;

    private String tags; // Comma separated tags string
}
