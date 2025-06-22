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
            // Create mock validation response
            ObjectNode responseData = objectMapper.createObjectNode();
            
            responseData.put("response_type", "validation_result");
            responseData.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            responseData.put("generated_by", "NotifyMe AI Validator v1.0");
            
            // When to notify section
            ObjectNode whenNotify = objectMapper.createObjectNode();
            whenNotify.put("detected", "daily");
            whenNotify.put("cron_expression", "0 9 * * *");
            whenNotify.put("date_time", "2025-01-20T09:00:00");
            responseData.set("when_notify", whenNotify);
            
            // Validity section
            ObjectNode validity = objectMapper.createObjectNode();
            boolean isValid = isValidPrompt(request.getPrompt());
            validity.put("out_of_bounds_prompt_length", request.getPrompt().length() > 1000);
            validity.put("offensive_language_detected", false);
            validity.put("nasty_instruction_detected", false);
            validity.put("purpose_valid", isValid);
            validity.put("reasonable_usage", true);
            validity.put("self_enforcing", true);
            validity.put("valid_prompt", isValid);
            
            if (!isValid) {
                validity.put("invalid_reason", "The prompt does not contain a clear notification request. Please describe what you want to be notified about.");
            } else {
                validity.putNull("invalid_reason");
            }
            
            responseData.set("validity", validity);
            
            // Summary section
            ObjectNode summary = objectMapper.createObjectNode();
            summary.put("text", "User wants to receive notifications about: " + request.getPrompt());
            summary.put("language", "en");
            summary.put("category", "general");
            summary.put("channel", request.getChannel() != null ? request.getChannel() : "email");
            responseData.set("summary", summary);
            
            // Metadata section
            ObjectNode metadata = objectMapper.createObjectNode();
            metadata.put("model_version", "1.0.0");
            metadata.put("confidence_score", 0.95);
            metadata.put("policy_enforced", true);
            metadata.set("tags", objectMapper.createArrayNode().add("notification").add("reminder").add(request.getChannel()));
            responseData.set("metadata", metadata);
            
            String jsonData = objectMapper.writeValueAsString(responseData);
            
            return new ValidatePromptResponse(
                true,
                isValid ? "Prompt validated successfully for " + request.getChannel() + " delivery" : "Prompt validation failed",
                jsonData
            );
            
        } catch (Exception e) {
            return new ValidatePromptResponse(
                false,
                "Internal validation error: " + e.getMessage(),
                "{}"
            );
        }
    }
    
    private boolean isValidPrompt(String prompt) {
        if (prompt == null || prompt.trim().length() < 10) {
            return false;
        }
        
        String lowerPrompt = prompt.toLowerCase();
        
        // Check for notification-related keywords
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