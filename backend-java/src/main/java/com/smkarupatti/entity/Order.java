package com.smkarupatti.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.smkarupatti.dto.AddressDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "customer_email")
    private String customerEmail;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "total_amount", nullable = false)
    @Builder.Default
    private Double totalAmount = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", length = 20)
    @Builder.Default
    private OrderType orderType = OrderType.WEBSITE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    // Shipping address
    @Column(name = "shipping_street")
    @JsonIgnore
    private String shippingStreet;

    @Column(name = "shipping_city")
    @JsonIgnore
    private String shippingCity;

    @Column(name = "shipping_state")
    @JsonIgnore
    private String shippingState;

    @Column(name = "shipping_pincode")
    @JsonIgnore
    private String shippingPincode;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty("shippingAddress")
    public AddressDto getShippingAddress() {
        if (shippingStreet == null && shippingCity == null && shippingState == null && shippingPincode == null) {
            return null;
        }
        return new AddressDto(shippingStreet, shippingCity, shippingState, shippingPincode);
    }

    public enum OrderType { WHATSAPP, WEBSITE }
    public enum Status { PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
}

