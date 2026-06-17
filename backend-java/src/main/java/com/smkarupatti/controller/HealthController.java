package com.smkarupatti.controller;

import com.smkarupatti.entity.User;
import com.smkarupatti.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "SM Original Karupatti API is running",
                "db", "MySQL"
        ));
    }

    @GetMapping("/health/test-bcrypt")
    public ResponseEntity<?> testBcrypt() {
        User user = userRepository.findByEmail("smkarupattishop@gmail.com").orElse(null);
        String dbHash = user != null ? user.getPassword() : null;
        boolean matches = false;
        if (dbHash != null) {
            matches = passwordEncoder.matches("smkarupattishop@2026", dbHash);
        }
        String generatedHash = passwordEncoder.encode("smkarupattishop@2026");
        boolean matchesGenerated = passwordEncoder.matches("smkarupattishop@2026", generatedHash);

        return ResponseEntity.ok(Map.of(
                "dbHash", dbHash != null ? dbHash : "null",
                "matchesDbHash", matches,
                "generatedHash", generatedHash,
                "matchesGenerated", matchesGenerated
        ));
    }
}
