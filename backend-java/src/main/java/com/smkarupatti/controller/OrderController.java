package com.smkarupatti.controller;

import com.smkarupatti.dto.OrderRequest;
import com.smkarupatti.entity.Order;
import com.smkarupatti.entity.OrderItem;
import com.smkarupatti.entity.User;
import com.smkarupatti.entity.Product;
import com.smkarupatti.repository.ProductRepository;
import com.smkarupatti.repository.OrderRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // POST /api/orders  (Private)
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest req,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        User user = null;
        if (userDetails != null) {
            Long userId = Long.parseLong(userDetails.getUsername());
            user = userRepository.findById(userId).orElse(null);
        }

        Order.OrderType orderType;
        try {
            orderType = req.getOrderType() != null
                    ? Order.OrderType.valueOf(req.getOrderType().toUpperCase())
                    : Order.OrderType.WEBSITE;
        } catch (IllegalArgumentException e) {
            orderType = Order.OrderType.WEBSITE;
        }

        Order order = Order.builder()
                .user(user)
                .customerName(req.getCustomerName())
                .customerPhone(req.getCustomerPhone())
                .customerEmail(req.getCustomerEmail())
                .totalAmount(req.getTotalAmount())
                .orderType(orderType)
                .notes(req.getNotes())
                .build();

        if (req.getShippingAddress() != null) {
            order.setShippingStreet(req.getShippingAddress().getStreet());
            order.setShippingCity(req.getShippingAddress().getCity());
            order.setShippingState(req.getShippingAddress().getState());
            order.setShippingPincode(req.getShippingAddress().getPincode());
        }

        // Build order items
        List<OrderItem> items = new ArrayList<>();
        if (req.getItems() != null) {
            for (var itemReq : req.getItems()) {
                Product product = productRepository.findById(itemReq.getProduct()).orElse(null);
                String productName = product != null ? product.getName() : "Unknown Product";
                String productImage = (product != null && product.getImages() != null && !product.getImages().isEmpty())
                        ? product.getImages().get(0).getUrl()
                        : "";
                Double pricePerKg = product != null ? product.getPricePerKg() : 0.0;

                Integer weight = itemReq.getWeightGrams();
                if (weight == null || weight <= 0) {
                    if (pricePerKg != null && pricePerKg > 0 && itemReq.getQuantity() != null && itemReq.getQuantity() > 0) {
                        double pricePerGram = pricePerKg / 1000.0;
                        weight = (int) Math.round(itemReq.getPrice() / (itemReq.getQuantity() * pricePerGram));
                    } else {
                        weight = 1000;
                    }
                }
                if (weight <= 0) {
                    weight = 1000;
                }

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .productId(itemReq.getProduct())
                        .name(productName)
                        .image(productImage)
                        .pricePerKg(pricePerKg)
                        .weightGrams(weight)
                        .quantity(itemReq.getQuantity())
                        .totalPrice(itemReq.getPrice())
                        .build();
                items.add(item);
            }
        }
        order.setItems(items);


        order = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "order", order));
    }

    // GET /api/orders/my-orders  (Private)
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(Map.of("success", true, "count", orders.size(), "orders", orders));
    }

    // GET /api/orders  (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(Map.of("success", true, "count", orders.size(), "orders", orders));
    }

    // GET /api/orders/:id  (Private)
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(userId);
        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        return ResponseEntity.ok(Map.of("success", true, "order", order));
    }

    // PUT /api/orders/:id/status  (Admin)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        try {
            order.setStatus(Order.Status.valueOf(body.get("status").toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }
        order = orderRepository.save(order);
        return ResponseEntity.ok(Map.of("success", true, "order", order));
    }
}
