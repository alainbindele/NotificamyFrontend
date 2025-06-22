package com.notifyme.service;

import com.notifyme.dto.ValidatePromptRequest;
import com.notifyme.dto.ValidatePromptResponse;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ValidationService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public ValidatePromptResponse validatePrompt(ValidatePromptRequest request, String userEmail, String userId) {
        try {
            // Create a mock validation response
            ObjectNode responseData = objectMapper.createObjectNode();
            
            responseData.put("response_type", "validation");
            responseData.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            responseData.put("generated_by", "NotifyMe AI Validator v1.0");
            
            // When to notify section
            ObjectNode whenNotify = objectMapper.createObjectNode();
            whenNotify.put("detected", "immediate");
            whenNotify.putNull("cron_expression");
            whenNotify.put("date_time", LocalDateTime.now().plusMinutes(5).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            responseData.set("when_notify", whenNotify);
            
            // Validity section - simple validation logic
            ObjectNode validity = objectMapper.createObjectNode();
            boolean isValidPrompt = validatePromptContent(request.getPrompt());
            
            validity.put("out_of_bounds_prompt_length", request.getPrompt().length() > 1000);
            validity.put("offensive_language_detected", false);
            validity.put("nasty_instruction_detected", false);
            validity.put("purpose_valid", isValidPrompt);
            validity.put("reasonable_usage", true);
            validity.put("self_enforcing", true);
            validity.put("valid_prompt", isValidPrompt && request.getPrompt().length() <= 1000);
            
            if (!isValidPrompt) {
                validity.put("invalid_reason", "The prompt does not contain a clear notification request. Please describe what you want to be notified about.");
            } else if (request.getPrompt().length() > 1000) {
                validity.put("invalid_reason", "Prompt is too long. Please keep it under 1000 characters.");
            } else {
                validity.putNull("invalid_reason");
            }
            
            responseData.set("validity", validity);
            
            // Summary section
            ObjectNode summary = objectMapper.createObjectNode();
            summary.put("text", "Notification request: " + request.getPrompt().substring(0, Math.min(100, request.getPrompt().length())));
            summary.put("language", "en");
            summary.put("category", "general");
            responseData.set("summary", summary);
            
            // Metadata section
            ObjectNode metadata = objectMapper.createObjectNode();
            metadata.put("model_version", "1.0.0");
            metadata.put("confidence_score", 0.95);
            metadata.put("policy_enforced", true);
            metadata.set("tags", objectMapper.createArrayNode().add("notification").add("user-request"));
            responseData.set("metadata", metadata);
            
            String jsonData = objectMapper.writeValueAsString(responseData);
            
            return new ValidatePromptResponse(
                true,
                "Validation completed successfully",
                jsonData
            );
            
        } catch (Exception e) {
            return new ValidatePromptResponse(
                false,
                "Validation failed: " + e.getMessage(),
                "{}"
            );
        }
    }
    
    private boolean validatePromptContent(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return false;
        }
        
        // Simple validation - check if prompt contains notification-related keywords
        String lowerPrompt = prompt.toLowerCase();
        String[] notificationKeywords = {
            "notify", "remind", "alert", "tell", "inform", "update", 
            "notification", "reminder", "message", "email", "send"
        };
        
        for (String keyword : notificationKeywords) {
            if (lowerPrompt.contains(keyword)) {
                return true;
            }
        }
        
        return false;
    }
}