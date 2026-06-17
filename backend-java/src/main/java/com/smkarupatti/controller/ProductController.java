package com.smkarupatti.controller;

import com.smkarupatti.dto.ProductRequest;
import com.smkarupatti.entity.Product;
import com.smkarupatti.entity.ProductImage;
import com.smkarupatti.repository.ProductRepository;
import com.smkarupatti.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;

    // GET /api/products
    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String featured) {

        List<Product> products;

        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else {
            Product.Category cat = null;
            Boolean isFeatured = null;
            if (category != null && !category.isBlank()) {
                try {
                    cat = Product.Category.valueOf(category.toUpperCase());
                } catch (IllegalArgumentException e) {
                    cat = null;
                }
            }
            if ("true".equalsIgnoreCase(featured)) {
                isFeatured = true;
            }
            products = productRepository.findWithFilters(cat, isFeatured);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", products.size());
        response.put("products", products);
        return ResponseEntity.ok(response);
    }

    // GET /api/products/:id
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return ResponseEntity.ok(Map.of("success", true, "product", product));
    }

    // POST /api/products (Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> files) throws IOException {

        com.smkarupatti.dto.ProductRequest req = new com.fasterxml.jackson.databind.ObjectMapper().readValue(dataJson, com.smkarupatti.dto.ProductRequest.class);
        List<ProductImage> images = new ArrayList<>();

        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .pricePerKg(req.getPricePerKg())
                .benefits(req.getBenefits())
                .category(parseCategory(req.getCategory()))
                .stock(req.getStock() != null ? req.getStock() : 0)
                .isAvailable(req.getIsAvailable() != null ? req.getIsAvailable() : true)
                .isFeatured(req.getIsFeatured() != null ? req.getIsFeatured() : false)
                .tags(req.getTags())
                .images(images)
                .build();

        product = productRepository.save(product);

        // Upload images after saving to have product id
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Map result = cloudinaryService.upload(file, "sm-karupatti/products");
                    ProductImage img = ProductImage.builder()
                            .url((String) result.get("secure_url"))
                            .publicId((String) result.get("public_id"))
                            .product(product)
                            .build();
                    product.getImages().add(img);
                }
            }
            product = productRepository.save(product);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "product", product));
    }

    // PUT /api/products/:id (Admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> files) throws IOException {

        com.smkarupatti.dto.ProductRequest req = new com.fasterxml.jackson.databind.ObjectMapper().readValue(dataJson, com.smkarupatti.dto.ProductRequest.class);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (req.getName() != null) product.setName(req.getName());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPricePerKg() != null) product.setPricePerKg(req.getPricePerKg());
        if (req.getBenefits() != null) product.setBenefits(req.getBenefits());
        if (req.getCategory() != null) product.setCategory(parseCategory(req.getCategory()));
        if (req.getStock() != null) product.setStock(req.getStock());
        if (req.getIsAvailable() != null) product.setIsAvailable(req.getIsAvailable());
        if (req.getIsFeatured() != null) product.setIsFeatured(req.getIsFeatured());
        if (req.getTags() != null) product.setTags(req.getTags());

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Map result = cloudinaryService.upload(file, "sm-karupatti/products");
                    ProductImage img = ProductImage.builder()
                            .url((String) result.get("secure_url"))
                            .publicId((String) result.get("public_id"))
                            .product(product)
                            .build();
                    product.getImages().add(img);
                }
            }
        }
        product = productRepository.save(product);
        return ResponseEntity.ok(Map.of("success", true, "product", product));
    }

    // DELETE /api/products/:id (Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        for (ProductImage img : product.getImages()) {
            if (img.getPublicId() != null && !img.getPublicId().isBlank()) {
                cloudinaryService.delete(img.getPublicId());
            }
        }
        productRepository.delete(product);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully"));
    }

    // DELETE /api/products/:id/images/:publicId (Admin)
    @DeleteMapping("/{id}/images/{publicId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProductImage(@PathVariable Long id,
                                                 @PathVariable String publicId) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        String decodedPublicId = java.net.URLDecoder.decode(publicId, java.nio.charset.StandardCharsets.UTF_8);
        cloudinaryService.delete(decodedPublicId);
        product.getImages().removeIf(img -> decodedPublicId.equals(img.getPublicId()));
        productRepository.save(product);
        return ResponseEntity.ok(Map.of("success", true, "product", product));
    }

    private Product.Category parseCategory(String category) {
        if (category == null) return Product.Category.KARUPATTI;
        try {
            return Product.Category.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Product.Category.OTHER;
        }
    }
}
