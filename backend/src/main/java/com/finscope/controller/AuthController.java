package com.finscope.controller;

import com.finscope.config.JwtUtil;
import com.finscope.model.JwtResponse;
import com.finscope.model.LoginRequest;
import com.finscope.model.RegisterRequest;
import com.finscope.model.User;
import com.finscope.dao.UserDao;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Handles user login and JWT token generation
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            // Authenticate the user credentials
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            
            // Generate token for the authenticated user
            User user = (User) auth.getPrincipal();
            String token = jwtUtil.generateToken(user);
            
            return ResponseEntity.ok(new JwtResponse(
                    token, user.getId(), user.getName(),
                    user.getEmail(), user.getRole().name()
            ));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // Return a clear 401 Unauthorized if credentials don't match
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    // Handles new user registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        // Prevent duplicate accounts
        if (userDao.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }
        
        // Build and save the new user securely
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword())) // Hash password before saving
                .role(User.Role.USER) // Default to standard user
                .build();
                
        userDao.save(user);
        
        // Automatically log them in after registration
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new JwtResponse(
                token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name()
        ));
    }
}

