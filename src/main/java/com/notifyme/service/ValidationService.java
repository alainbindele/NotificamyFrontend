package com.notifyme.service;

import com.notifyme.dto.ValidatePromptRequest;
import com.notifyme.dto.ValidatePromptResponse;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ValidationService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public ValidatePromptResponse validatePrompt(ValidatePromptRequest request, String userEmail, String userId) {
        try {
            // Parse and validate timezone
            ZoneId userTimezone;
            String validatedTimezone;
            try {
                String requestedTimezone = request.getTimezone();
                if (requestedTimezone == null || requestedTimezone.trim().isEmpty()) {
                    requestedTimezone = "UTC";
                }
                userTimezone = ZoneId.of(requestedTimezone);
                validatedTimezone = requestedTimezone;
                System.out.println("Using timezone: " + validatedTimezone);
            } catch (Exception e) {
                System.out.println("Invalid timezone '" + request.getTimezone() + "', falling back to UTC: " + e.getMessage());
                userTimezone = ZoneId.of("UTC"); // Fallback to UTC
                validatedTimezone = "UTC";
            }
            
            // Create timestamps in user's timezone
            ZonedDateTime now = ZonedDateTime.now(userTimezone);
            ZonedDateTime scheduledTime = now.plusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0);
            
            // Create mock validation response
            ObjectNode responseData = objectMapper.createObjectNode();
            
            responseData.put("response_type", "validation_result");
            responseData.put("timestamp", now.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
            responseData.put("generated_by", "NotifyMe AI Validator v1.0");
            responseData.put("user_timezone", validatedTimezone);
            
            // When to notify section
            ObjectNode whenNotify = objectMapper.createObjectNode();
            whenNotify.put("detected", "daily");
            whenNotify.put("cron_expression", "0 9 * * *");
            whenNotify.put("date_time", scheduledTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
            whenNotify.put("timezone", validatedTimezone);
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
            
            // Add channels to summary
            if (request.getChannels() != null && !request.getChannels().isEmpty()) {
                ArrayNode channelsArray = objectMapper.createArrayNode();
                request.getChannels().forEach(channelsArray::add);
                summary.set("channels", channelsArray);
            }
            
            responseData.set("summary", summary);
            
            // Metadata section
            ObjectNode metadata = objectMapper.createObjectNode();
            metadata.put("model_version", "1.0.0");
            metadata.put("confidence_score", 0.95);
            metadata.put("policy_enforced", true);
            
            ArrayNode tagsArray = objectMapper.createArrayNode();
            tagsArray.add("notification");
            tagsArray.add("reminder");
            if (request.getChannels() != null) {
                request.getChannels().forEach(tagsArray::add);
            }
            metadata.set("tags", tagsArray);
            
            responseData.set("metadata", metadata);
            
            // Add channel configurations for logging/processing
            if (request.getChannelConfigs() != null && !request.getChannelConfigs().isEmpty()) {
                ObjectNode configsNode = objectMapper.createObjectNode();
                request.getChannelConfigs().forEach((key, value) -> {
                    if (value != null) {
                        configsNode.put(key, value.toString());
                    }
                });
                responseData.set("channel_configs", configsNode);
            }
            
            String jsonData = objectMapper.writeValueAsString(responseData);
            
            String channelsText = request.getChannels() != null ? 
                String.join(", ", request.getChannels()) : "email";
            
            return new ValidatePromptResponse(
                true,
                isValid ? "Prompt validated successfully for delivery via: " + channelsText : "Prompt validation failed",
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