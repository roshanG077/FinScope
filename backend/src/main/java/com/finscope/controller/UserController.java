package com.finscope.controller;

import com.finscope.model.User;
import com.finscope.dao.UserDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User authUser,
                                           @RequestBody Map<String, String> body) {
        return userDao.findById(authUser.getId()).map(user -> {
            if (body.get("name") != null && !body.get("name").isBlank()) {
                user.setName(body.get("name"));
            }
            userDao.save(user);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "name", user.getName()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal User authUser,
                                            @RequestBody Map<String, String> body) {
        return userDao.findById(authUser.getId()).map(user -> {
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Passwords cannot be empty"));
            }

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userDao.save(user);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(@AuthenticationPrincipal User authUser,
                                            @RequestBody Map<String, String> body) {
        return userDao.findById(authUser.getId()).map(user -> {
            if (body.get("preferences") != null) {
                user.setPreferences(body.get("preferences"));
            }
            userDao.save(user);
            return ResponseEntity.ok(Map.of("message", "Settings updated successfully", "preferences", user.getPreferences()));
        }).orElse(ResponseEntity.notFound().build());
    }
}
