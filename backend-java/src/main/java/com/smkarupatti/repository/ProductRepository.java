package com.smkarupatti.repository;

import com.smkarupatti.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsFeaturedTrue();
    List<Product> findByCategory(Product.Category category);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("search") String search);

    @Query("SELECT p FROM Product p WHERE (:category IS NULL OR p.category = :category) AND (:featured IS NULL OR p.isFeatured = :featured) ORDER BY p.createdAt DESC")
    List<Product> findWithFilters(@Param("category") Product.Category category,
                                  @Param("featured") Boolean featured);
}
