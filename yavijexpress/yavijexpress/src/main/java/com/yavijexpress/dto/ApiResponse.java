// FILE: ApiResponse.java
package com.yavijexpress.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private T data;
    private String path;

    public ApiResponse(LocalDateTime timestamp, int status, String message, T data, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.data = data;
        this.path = path;
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                message,
                data,
                null
        );
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                message,
                data,
                null
        );
    }

    public static ApiResponse<?> error(String message, HttpStatus status) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                status.value(),
                message,
                null,
                null
        );
    }

    public static ApiResponse<?> error(String message) {
        return new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                message,
                null,
                null
        );
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}