package com.notifyme.controller;

import com.notifyme.dto.ValidatePromptRequest;
import com.notifyme.dto.ValidatePromptResponse;
import com.notifyme.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ValidationController {

    @Autowired
    private ValidationService validationService;

    @PostMapping("/validate-prompt")
    public ResponseEntity<ValidatePromptResponse> validatePrompt(
            @Valid @RequestBody ValidatePromptRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        
        // Ottieni informazioni dall'utente autenticato
        String userEmail = jwt.getClaimAsString("email");
        String userId = jwt.getSubject();
        
        // Log per debug
        System.out.println("Authenticated user: " + userEmail + " (ID: " + userId + ")");
        System.out.println("Request: " + request.getPrompt());
        
        try {
            ValidatePromptResponse response = validationService.validatePrompt(request, userEmail, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ValidatePromptResponse(false, "Validation failed: " + e.getMessage(), "{}"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running");
    }
}