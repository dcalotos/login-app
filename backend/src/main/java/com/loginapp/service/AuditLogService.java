package com.loginapp.service;

import com.loginapp.entity.AuditLog;
import com.loginapp.entity.User;
import com.loginapp.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(User user, String action, String details, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .build();

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getUserAuditLogs(User user) {
        return auditLogRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<AuditLog> getRecentUserAuditLogs(User user, int limit) {
        return auditLogRepository.findTop10ByUserOrderByCreatedAtDesc(user);
    }
}
