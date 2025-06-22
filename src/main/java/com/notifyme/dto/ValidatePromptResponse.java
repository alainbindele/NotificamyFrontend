package com.notifyme.dto;

public class ValidatePromptResponse {
    private boolean success;
    private String message;
    private String data;
    
    // Default constructor
    public ValidatePromptResponse() {}
    
    // Constructor with parameters
    public ValidatePromptResponse(boolean success, String message, String data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // Getters and setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getData() {
        return data;
    }
    
    public void setData(String data) {
        this.data = data;
    }
    
    @Override
    public String toString() {
        return "ValidatePromptResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}