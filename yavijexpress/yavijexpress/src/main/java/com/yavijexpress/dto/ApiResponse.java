// FILE: ApiResponse.java
package com.yavijexpress.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private T data;
    private String path;

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
}