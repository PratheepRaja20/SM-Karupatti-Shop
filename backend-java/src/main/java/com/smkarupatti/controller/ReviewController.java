package com.smkarupatti.controller;

import com.smkarupatti.dto.ReviewRequest;
import com.smkarupatti.entity.Product;
import com.smkarupatti.entity.Review;
import com.smkarupatti.entity.User;
import com.smkarupatti.repository.ProductRepository;
import com.smkarupatti.repository.ReviewRepository;
import com.smkarupatti.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // GET /api/reviews (Disabled)
    @GetMapping
    public ResponseEntity<?> getReviews() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("success", false, "message", "Reviews feature is disabled"));
    }

    // GET /api/reviews/admin (Disabled)
    @GetMapping("/admin")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("success", false, "message", "Reviews feature is disabled"));
    }

    // POST /api/reviews (Disabled)
    @PostMapping
    public ResponseEntity<?> createReview() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("success", false, "message", "Reviews feature is disabled"));
    }

    // PUT /api/reviews/:id/approve (Disabled)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveReview() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("success", false, "message", "Reviews feature is disabled"));
    }

    // DELETE /api/reviews/:id (Disabled)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("success", false, "message", "Reviews feature is disabled"));
    }
}
