package com.smkarupatti.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String password;
    private AddressDto address;
}
