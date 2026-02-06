package com.loginapp.service;

import com.loginapp.dto.*;
import com.loginapp.entity.RefreshToken;
import com.loginapp.entity.User;
import com.loginapp.exception.TokenRefreshException;
import com.loginapp.repository.UserRepository;
import com.loginapp.security.JwtTokenProvider;
import com.loginapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;
    private final EmailVerificationService emailVerificationService;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest, String ipAddress) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId());

        // Update last login
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Log the action
        auditLogService.logAction(user, "LOGIN", "User logged in successfully", ipAddress);

        return JwtResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .id(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .build();
    }

    @Transactional
    public MessageResponse register(SignupRequest signupRequest, String ipAddress) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .isActive(true)
                .isVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        // Send email verification
        emailVerificationService.createVerificationToken(savedUser);

        // Log the action
        auditLogService.logAction(savedUser, "REGISTER", "User registered successfully", ipAddress);

        log.info("User registered successfully: {}", savedUser.getUsername());
        return new MessageResponse("User registered successfully! Please check your email to verify your account.");
    }

    @Transactional
    public JwtResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = tokenProvider.generateTokenFromUsername(user.getUsername());
                    return JwtResponse.builder()
                            .accessToken(token)
                            .refreshToken(requestRefreshToken)
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @Transactional
    public MessageResponse logout(Long userId, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        refreshTokenService.deleteByUserId(userId);
        
        // Log the action
        auditLogService.logAction(user, "LOGOUT", "User logged out successfully", ipAddress);

        return new MessageResponse("User logged out successfully!");
    }
}
