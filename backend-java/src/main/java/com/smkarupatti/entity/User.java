package com.smkarupatti.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.smkarupatti.dto.AddressDto;
import com.smkarupatti.dto.AvatarDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Role role = Role.USER;

    // Avatar
    @Column(name = "avatar_url")
    @Builder.Default
    @JsonIgnore
    private String avatarUrl = "";

    @Column(name = "avatar_public_id")
    @Builder.Default
    @JsonIgnore
    private String avatarPublicId = "";

    // Address
    @Column(name = "address_street")
    @JsonIgnore
    private String addressStreet;

    @Column(name = "address_city")
    @JsonIgnore
    private String addressCity;

    @Column(name = "address_state")
    @JsonIgnore
    private String addressState;

    @Column(name = "address_pincode")
    @JsonIgnore
    private String addressPincode;

    // Password reset
    @Column(name = "reset_password_token")
    @JsonIgnore
    private String resetPasswordToken;

    @Column(name = "reset_password_expire")
    @JsonIgnore
    private LocalDateTime resetPasswordExpire;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty("avatar")
    public AvatarDto getAvatar() {
        return new AvatarDto(avatarUrl, avatarPublicId);
    }

    @JsonProperty("address")
    public AddressDto getAddress() {
        if (addressStreet == null && addressCity == null && addressState == null && addressPincode == null) {
            return null;
        }
        return new AddressDto(addressStreet, addressCity, addressState, addressPincode);
    }

    public enum Role {
        USER, ADMIN
    }
}

