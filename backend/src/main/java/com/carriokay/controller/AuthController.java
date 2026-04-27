package com.carriokay.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carriokay.dto.LoginRequest;
import com.carriokay.model.Role;
import com.carriokay.model.User;
import com.carriokay.security.JwtUtil;
import com.carriokay.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {

        try {
            User savedUser = authService.register(user);
            return ResponseEntity.ok(savedUser);
        } 
        catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            User user = authService.login(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user
            ));
        } 
        catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        try {
            return ResponseEntity.ok(
                Map.of("message", authService.sendOtp(req.get("email")))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {
        try {
            User user = new User();
            user.setName(req.get("name"));
            user.setEmail(req.get("email"));
            user.setPassword(req.get("password"));
            user.setRole(Role.valueOf(req.get("role")));

            return ResponseEntity.ok(
                authService.verifyOtpAndRegister(user, req.get("otp"))
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}