package com.smkarupatti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Message is required")
    private String message;
}
