package com.smkarupatti.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Order order;

    @Column(name = "product_id")
    @JsonProperty("product")
    private Long productId;

    @Column
    private String name;

    @Column
    private String image;

    @Column(name = "price_per_kg")
    private Double pricePerKg;

    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Column
    private Integer quantity;

    @Column(name = "total_price")
    private Double totalPrice;
}

