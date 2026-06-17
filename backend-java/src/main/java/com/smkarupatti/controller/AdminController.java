package com.smkarupatti.controller;

import com.smkarupatti.entity.Order;
import com.smkarupatti.entity.User;
import com.smkarupatti.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final ContactRepository contactRepository;

    // GET /api/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        long totalUsers = userRepository.countByRole(User.Role.USER);
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalReviews = 0;
        long pendingReviews = 0;
        long unreadContacts = contactRepository.countByIsReadFalse();
        double totalRevenue = orderRepository.getTotalRevenue().orElse(0.0);

        // Recent 5 orders
        List<Order> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(5).toList();

        // Order status counts
        Map<String, Long> orderStatusCounts = new LinkedHashMap<>();
        for (Order.Status status : Order.Status.values()) {
            orderStatusCounts.put(status.name().toLowerCase(), orderRepository.countByStatus(status));
        }

        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalProducts", totalProducts);
        analytics.put("totalOrders", totalOrders);
        analytics.put("totalReviews", totalReviews);
        analytics.put("pendingReviews", pendingReviews);
        analytics.put("unreadContacts", unreadContacts);
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("recentOrders", recentOrders);
        analytics.put("orderStatusCounts", orderStatusCounts);

        return ResponseEntity.ok(Map.of("success", true, "analytics", analytics));
    }

    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        var users = userRepository.findAll();
        users.sort(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return ResponseEntity.ok(Map.of("success", true, "count", users.size(), "users", users));
    }

    // GET /api/admin/users/:id
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    // PUT /api/admin/users/:id
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (body.get("role") != null) {
            try {
                user.setRole(User.Role.valueOf(body.get("role").toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
            }
        }
        user = userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "user", user));
    }

    // DELETE /api/admin/users/:id
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted"));
    }
}
