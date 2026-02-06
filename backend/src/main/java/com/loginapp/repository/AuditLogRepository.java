package com.loginapp.repository;

import com.loginapp.entity.AuditLog;
import com.loginapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByUserOrderByCreatedAtDesc(User user);
    
    List<AuditLog> findTop10ByUserOrderByCreatedAtDesc(User user);
}
