package com.oracle.flightmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for testing
                .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // allow all endpoints without authentication
                )
                .formLogin(login -> login.disable()) // disable the default login form
                .httpBasic(httpBasic -> httpBasic.disable()); // also disable HTTP Basic auth

        return http.build();
    }
}
