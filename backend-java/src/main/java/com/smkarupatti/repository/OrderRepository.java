package com.smkarupatti.repository;

import com.smkarupatti.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    Optional<Double> getTotalRevenue();

    long countByStatus(Order.Status status);
}
