package com.loginapp.controller;

import com.loginapp.dto.UserResponse;
import com.loginapp.security.UserPrincipal;
import com.loginapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse userResponse = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @RequestBody UserResponse updateRequest) {
        UserResponse userResponse = userService.updateUserProfile(userPrincipal.getId(), updateRequest);
        return ResponseEntity.ok(userResponse);
    }
}
