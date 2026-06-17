package com.smkarupatti.controller;

import com.smkarupatti.dto.*;
import com.smkarupatti.entity.User;
import com.smkarupatti.repository.UserRepository;
import com.smkarupatti.security.JwtTokenProvider;
import com.smkarupatti.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${app.client.url}")
    private String clientUrl;

    private Map<String, Object> buildAuthResponse(User user, String token) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("_id", user.getId());
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("phone", user.getPhone());
        userMap.put("role", user.getRole().name().toLowerCase());
        userMap.put("avatar", user.getAvatar());
        userMap.put("address", user.getAddress());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userMap);
        response.put("token", token);
        return response;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists with this email");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.USER)
                .build();
        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(buildAuthResponse(user, token));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String emailLower = req.getEmail().toLowerCase().trim();
        // Support literal "admin" as shortcut for smkarupattishop@gmail.com
        if ("admin".equals(emailLower)) {
            emailLower = "smkarupattishop@gmail.com";
        }

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            emailLower, req.getPassword()));
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        User user = userRepository.findByEmail(emailLower)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        String token = jwtTokenProvider.generateToken(user.getId());
        return ResponseEntity.ok(buildAuthResponse(user, token));
    }

    // GET /api/auth/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("_id", user.getId());
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("phone", user.getPhone());
        userMap.put("role", user.getRole().name().toLowerCase());
        userMap.put("avatar", user.getAvatar());
        userMap.put("address", user.getAddress());
        userMap.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(Map.of("success", true, "user", userMap));
    }

    // PUT /api/auth/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (req.getName() != null)
            user.setName(req.getName());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getAddress() != null) {
            user.setAddressStreet(req.getAddress().getStreet());
            user.setAddressCity(req.getAddress().getCity());
            user.setAddressState(req.getAddress().getState());
            user.setAddressPincode(req.getAddress().getPincode());
        }
        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId());
        return ResponseEntity.ok(buildAuthResponse(user, token));
    }


}
