package com.smkarupatti.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private String street;
    private String city;
    private String state;
    private String pincode;
}
