package com.yavijexpress.config;

import com.yavijexpress.security.JwtAuthenticationFilter;
import com.yavijexpress.security.LogoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final LogoutService logoutService;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService, LogoutService logoutService, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.logoutService = logoutService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for stateless API
                .csrf(AbstractHttpConfigurer::disable)

                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Configure authorization rules
                .authorizeHttpRequests(auth -> auth
                        // ============ PUBLIC ENDPOINTS (NO AUTH REQUIRED) ============
                        .requestMatchers(
                                // Authentication
                                "/api/auth/**",

                                // WebSocket
                                "/ws/**",

                                // Static resources
                                "/booking-test.html",
                                "/*.html",
                                "/css/**",
                                "/js/**",
                                "/images/**",

                                // Swagger/OpenAPI
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/api-docs.yaml",
                                "/webjars/**",
                                "/swagger-resources/**",

                                // Actuator (for monitoring)
                                "/actuator/health",
                                "/actuator/info",

                                // Public APIs
                                "/api/public/**"
                        ).permitAll()

                        // ============ EMERGENCY ENDPOINTS (Limited access) ============
                        .requestMatchers(HttpMethod.POST, "/api/emergency/sos").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/emergency/panic/**").permitAll()

                        // ============ ADMIN ENDPOINTS ============
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ============ DRIVER ENDPOINTS ============
                        .requestMatchers(
                                "/api/driver/**",
                                "/api/vehicles/**"
                        ).hasAnyRole("DRIVER", "ADMIN")

                        // ============ PASSENGER ENDPOINTS ============
                        .requestMatchers("/api/passenger/**").hasAnyRole("PASSENGER", "ADMIN")
                        
                        // ============ BOOKING ENDPOINTS (All authenticated users) ============
                        .requestMatchers("/api/bookings/**").authenticated()

                        // ============ TRIPS (Driver can create, all can search/view) ============
                        .requestMatchers(HttpMethod.POST, "/api/trips/search").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/trips/**").hasAnyRole("DRIVER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/trips/**").hasAnyRole("DRIVER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/trips/**").hasAnyRole("DRIVER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/trips/**").authenticated()

                        // ============ PAYMENTS (Authenticated users) ============
                        .requestMatchers("/api/payments/**").authenticated()

                        // ============ RATINGS & COMPLAINTS (Authenticated users) ============
                        .requestMatchers("/api/ratings/**").authenticated()
                        .requestMatchers("/api/complaints/**").authenticated()

                        // ============ NOTIFICATIONS & PROFILE (Authenticated users) ============
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()

                        // ============ EMERGENCY (Other endpoints need auth) ============
                        .requestMatchers("/api/emergency/**").authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                // Configure session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configure authentication provider
                .authenticationProvider(authenticationProvider())

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Configure logout
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .addLogoutHandler(logoutService)
                        .logoutSuccessHandler((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                            response.setStatus(200);
                            response.getWriter().write("{\"message\":\"Logged out successfully\"}");
                        })
                        .permitAll()
                )

                // Configure exception handling
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"error\":\"Unauthorized\",\"message\":\"Authentication required\",\"status\":401}"
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"error\":\"Forbidden\",\"message\":\"Insufficient permissions\",\"status\":403}"
                            );
                        })
                );

        return http.build();
    }



    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strong hashing
    }
}