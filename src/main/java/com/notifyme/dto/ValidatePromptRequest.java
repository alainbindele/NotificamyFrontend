package com.notifyme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;

public class ValidatePromptRequest {
    
    @NotBlank(message = "Prompt cannot be empty")
    @Size(min = 10, max = 1000, message = "Prompt must be between 10 and 1000 characters")
    private String prompt;
    
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email must be valid")
    private String email;
    
    @Pattern(regexp = "^[A-Za-z]+/[A-Za-z_]+$|^UTC$", message = "Invalid timezone format. Use IANA timezone identifiers like 'Europe/Rome' or 'UTC'")
    private String timezone = "UTC"; // Default to UTC
    
    private List<String> channels;
    private Map<String, Object> channelConfigs;
    
    // Default constructor
    public ValidatePromptRequest() {}
    
    // Constructor with parameters
    public ValidatePromptRequest(String prompt, String email) {
        this.prompt = prompt;
        this.email = email;
        this.timezone = "UTC";
    }
    
    public ValidatePromptRequest(String prompt, String email, String timezone, List<String> channels, Map<String, Object> channelConfigs) {
        this.prompt = prompt;
        this.email = email;
        this.timezone = timezone != null ? timezone : "UTC";
        this.channels = channels;
        this.channelConfigs = channelConfigs;
    }
    
    // Getters and setters
    public String getPrompt() {
        return prompt;
    }
    
    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getTimezone() {
        return timezone;
    }
    
    public void setTimezone(String timezone) {
        this.timezone = timezone != null ? timezone : "UTC";
    }
    
    public List<String> getChannels() {
        return channels;
    }
    
    public void setChannels(List<String> channels) {
        this.channels = channels;
    }
    
    public Map<String, Object> getChannelConfigs() {
        return channelConfigs;
    }
    
    public void setChannelConfigs(Map<String, Object> channelConfigs) {
        this.channelConfigs = channelConfigs;
    }
    
    @Override
    public String toString() {
        return "ValidatePromptRequest{" +
                "prompt='" + prompt + '\'' +
                ", email='" + email + '\'' +
                ", timezone='" + timezone + '\'' +
                ", channels=" + channels +
                ", channelConfigs=" + channelConfigs +
                '}';
    }
}