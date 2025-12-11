package com.yavijexpress.security;

import com.yavijexpress.utils.SMSServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;
    private static final Logger log = LoggerFactory.getLogger(SMSServiceImpl.class);

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService, TokenBlacklistService tokenBlacklistService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    // List of public endpoints that don't require JWT
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/verify-otp",
            "/api/auth/send-otp",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/swagger-ui/",
            "/v3/api-docs/",
            "/api-docs",
            "/actuator/health",
            "/actuator/info"
    );

    // Emergency endpoints (require special handling)
    private static final List<String> EMERGENCY_ENDPOINTS = List.of(
            "/api/emergency/sos",
            "/api/emergency/panic/"
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        log.debug("Processing request: {} {}", request.getMethod(), requestURI);

        // Check if it's a public endpoint
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check for emergency endpoints (special handling)
        if (isEmergencyEndpoint(requestURI)) {
            handleEmergencyEndpoint(request, response, filterChain);
            return;
        }

        // Validate Authorization header
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header for: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            // Check if token is blacklisted (logout)
            if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
                log.warn("Blacklisted token used for: {}", requestURI);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Token invalidated\",\"message\":\"Please login again\"}");
                return;
            }

            // Extract username from token
            userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user details
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.debug("Authenticated user: {} for {}", userEmail, requestURI);

                    // Add custom headers for frontend
                    addCustomHeaders(response, userDetails);
                }
            }

        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired for {}: {}", requestURI, e.getMessage());
            handleJwtError(response, "Token expired", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token for {}: {}", requestURI, e.getMessage());
            handleJwtError(response, "Invalid token format", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (SignatureException e) {
            log.warn("Invalid JWT signature for {}: {}", requestURI, e.getMessage());
            handleJwtError(response, "Invalid token signature", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (UsernameNotFoundException e) {
            log.warn("User not found for token: {}", e.getMessage());
            handleJwtError(response, "User not found", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            log.error("Unexpected error during JWT authentication for {}: {}",
                    requestURI, e.getMessage(), e);
            // Don't return error for profile endpoint, let it continue
            if (!requestURI.contains("/profile")) {
                handleJwtError(response, "Authentication error", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestURI) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(requestURI::startsWith);
    }

    private boolean isEmergencyEndpoint(String requestURI) {
        return EMERGENCY_ENDPOINTS.stream().anyMatch(requestURI::startsWith);
    }

    private void handleEmergencyEndpoint(HttpServletRequest request,
                                         HttpServletResponse response,
                                         FilterChain filterChain)
            throws IOException, ServletException {

        // For emergency endpoints, we allow without JWT but with rate limiting
        // You can implement IP-based rate limiting here

        // Check if they have a token anyway (for authenticated emergencies)
        String authHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                String userEmail = jwtService.extractUsername(jwt);
                if (userEmail != null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        // Set authentication for logged-in users
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                log.warn("Invalid token for emergency endpoint: {}", e.getMessage());
                // Continue without authentication (allow emergency call)
            }
        }

        filterChain.doFilter(request, response);
    }

    private void handleJwtError(HttpServletResponse response, String message, int status)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(
                String.format("{\"error\":\"JWT Error\",\"message\":\"%s\",\"status\":%d}",
                        message, status)
        );
    }

    private void addCustomHeaders(HttpServletResponse response, UserDetails userDetails) {
        // Extract user ID and role from userDetails (you might need to customize)
        // For now, we'll add basic headers
        response.setHeader("X-Authenticated", "true");

        // If your UserDetails implementation has additional info, add them here
        // Example: response.setHeader("X-User-ID", userDetails.getId());
        // Example: response.setHeader("X-User-Role", userDetails.getRole());
    }
}