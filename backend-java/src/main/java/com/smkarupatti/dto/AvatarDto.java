package com.smkarupatti.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvatarDto {
    private String url = "";
    private String publicId = "";
}
