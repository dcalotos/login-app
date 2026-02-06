package com.loginapp.controller;

import com.loginapp.dto.*;
import com.loginapp.security.UserPrincipal;
import com.loginapp.service.AuthService;
import com.loginapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                            HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        JwtResponse response = authService.login(loginRequest, ipAddress);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody SignupRequest signupRequest,
                                                    HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        MessageResponse response = authService.register(signupRequest, ipAddress);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        JwtResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                  HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        MessageResponse response = authService.logout(userPrincipal.getId(), ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse userResponse = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(userResponse);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
