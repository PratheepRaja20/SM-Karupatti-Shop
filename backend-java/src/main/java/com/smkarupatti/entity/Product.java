package com.smkarupatti.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_kg", nullable = false)
    private Double pricePerKg;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    // Benefits stored as comma-separated string
    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Category category = Category.KARUPATTI;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(nullable = false)
    @Builder.Default
    private Double ratings = 0.0;

    @Column(name = "num_reviews", nullable = false)
    @Builder.Default
    private Integer numReviews = 0;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    // Tags stored as comma-separated string
    private String tags;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Category {
        KARUPATTI, PANANGKARKANDU, TAMARIND, OTHER
    }

    // Helper: benefits as list
    @Transient
    public List<String> getBenefitsList() {
        if (benefits == null || benefits.isBlank()) return new ArrayList<>();
        return List.of(benefits.split(","));
    }

    @Transient
    public List<String> getTagsList() {
        if (tags == null || tags.isBlank()) return new ArrayList<>();
        return List.of(tags.split(","));
    }
}
