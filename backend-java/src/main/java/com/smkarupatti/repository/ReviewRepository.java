package com.smkarupatti.repository;

import com.smkarupatti.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByIsApprovedTrueOrderByCreatedAtDesc();
    List<Review> findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(Long productId);
    List<Review> findAllByOrderByCreatedAtDesc();
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    long countByIsApproved(boolean isApproved);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isApproved = true")
    Optional<Double> getAverageRating(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isApproved = true")
    long countApprovedByProductId(@Param("productId") Long productId);
}
