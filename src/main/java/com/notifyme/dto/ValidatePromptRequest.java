package com.notifyme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ValidatePromptRequest {
    
    @NotBlank(message = "Prompt cannot be empty")
    @Size(min = 10, max = 1000, message = "Prompt must be between 10 and 1000 characters")
    private String prompt;
    
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email must be valid")
    private String email;
    
    private String channel = "email"; // Default to email
    
    // Default constructor
    public ValidatePromptRequest() {}
    
    // Constructor with parameters
    public ValidatePromptRequest(String prompt, String email) {
        this.prompt = prompt;
        this.email = email;
    }
    
    public ValidatePromptRequest(String prompt, String email, String channel) {
        this.prompt = prompt;
        this.email = email;
        this.channel = channel;
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
    
    public String getChannel() {
        return channel;
    }
    
    public void setChannel(String channel) {
        this.channel = channel;
    }
    
    @Override
    public String toString() {
        return "ValidatePromptRequest{" +
                "prompt='" + prompt + '\'' +
                ", email='" + email + '\'' +
                ", channel='" + channel + '\'' +
                '}';
    }
}