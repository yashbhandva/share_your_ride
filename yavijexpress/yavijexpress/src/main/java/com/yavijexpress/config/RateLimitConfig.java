package com.yavijexpress.config;

import com.yavijexpress.utils.RateLimitInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor())
                .addPathPatterns("/api/emergency/sos")
                .addPathPatterns("/api/emergency/panic/**")
                .excludePathPatterns("/api-docs/**", "/swagger-ui/**");
    }
}