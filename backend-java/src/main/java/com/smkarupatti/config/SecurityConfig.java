package com.smkarupatti.config;

import com.smkarupatti.security.JwtAuthenticationFilter;
import com.smkarupatti.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder builder = http
                .getSharedObject(
                        org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder.class);
        builder.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return builder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health/**").permitAll()
                        .requestMatchers("GET", "/api/products/**").permitAll()
                        .requestMatchers("GET", "/api/reviews").permitAll()
                        .requestMatchers("POST", "/api/contact").permitAll()
                        .requestMatchers("POST", "/api/orders").permitAll()
                        // Admin-only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("POST", "/api/products/**").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/products/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/products/**").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/reviews/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/reviews/**").hasRole("ADMIN")
                        .requestMatchers("GET", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers("DELETE", "/api/contact/**").hasRole("ADMIN")
                        .requestMatchers("GET", "/api/orders").hasRole("ADMIN")
                        .requestMatchers("PUT", "/api/orders/**").hasRole("ADMIN")
                        // Everything else requires authentication
                        .anyRequest().authenticated())
                .authenticationProvider(authProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
