package com.finscope.controller;

import com.finscope.model.Transaction.TransactionType;
import com.finscope.model.User;
import com.finscope.dao.TransactionDao;
import com.finscope.dao.UserDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserDao userDao;
    private final TransactionDao transactionDao;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                        @RequestBody Map<String, String> body) {
        return userDao.findById(id).map(user -> {
            user.setRole(User.Role.valueOf(body.get("role").toUpperCase()));
            return ResponseEntity.ok(userDao.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        return userDao.findById(id).map(user -> {
            user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
            return ResponseEntity.ok(userDao.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userDao.findById(id).map(user -> {
            userDao.delete(user);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics")
    public Map<String, Object> getGlobalAnalytics() {
        long totalUsers  = userDao.count();
        long adminCount  = userDao.countByRole(User.Role.ADMIN);
        long userCount   = userDao.countByRole(User.Role.USER);
        var  totalIncome  = transactionDao.globalSum(TransactionType.INCOME);
        var  totalExpense = transactionDao.globalSum(TransactionType.EXPENSE);

        return Map.of(
                "totalUsers",   totalUsers,
                "adminCount",   adminCount,
                "userCount",    userCount,
                "totalIncome",  totalIncome,
                "totalExpense", totalExpense,
                "netBalance",   totalIncome.subtract(totalExpense)
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long id) {
        return userDao.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
