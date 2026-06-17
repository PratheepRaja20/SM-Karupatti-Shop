package com.smkarupatti.controller;

import com.smkarupatti.dto.ContactRequest;
import com.smkarupatti.entity.Contact;
import com.smkarupatti.repository.ContactRepository;
import com.smkarupatti.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    // POST /api/contact  (Public)
    @PostMapping
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactRequest req) {
        Contact contact = Contact.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .message(req.getMessage())
                .build();
        contact = contactRepository.save(contact);

        // Send email to admin
        try {
            emailService.sendEmail(
                    adminEmail,
                    "New Contact Message from " + req.getName() + " — SM Karupatti",
                    emailService.getContactEmailTemplate(req.getName(), req.getEmail(), req.getPhone(), req.getMessage())
            );
        } catch (Exception e) {
            log.error("Email send failed: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Thank you for contacting us! We will get back to you soon.",
                "contact", contact
        ));
    }

    // GET /api/contact  (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getContacts() {
        List<Contact> contacts = contactRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(Map.of("success", true, "count", contacts.size(), "contacts", contacts));
    }

    // PUT /api/contact/:id/read  (Admin)
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found"));
        contact.setIsRead(true);
        contact = contactRepository.save(contact);
        return ResponseEntity.ok(Map.of("success", true, "contact", contact));
    }

    // DELETE /api/contact/:id  (Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found"));
        contactRepository.delete(contact);
        return ResponseEntity.ok(Map.of("success", true, "message", "Contact message deleted"));
    }
}
