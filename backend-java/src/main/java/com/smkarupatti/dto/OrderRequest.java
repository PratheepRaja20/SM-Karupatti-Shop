package com.smkarupatti.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    private String customerEmail;

    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemRequest> items;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;

    private String orderType; // "website" or "whatsapp"

    private AddressDto shippingAddress;

    private String notes;
}
