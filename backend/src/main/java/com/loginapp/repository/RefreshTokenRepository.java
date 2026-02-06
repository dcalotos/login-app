package com.loginapp.repository;

import com.loginapp.entity.RefreshToken;
import com.loginapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    int deleteByUser(User user);
    
    @Modifying
    int deleteByToken(String token);
}
