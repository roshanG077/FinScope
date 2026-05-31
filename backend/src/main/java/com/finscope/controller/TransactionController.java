package com.finscope.controller;

import com.finscope.model.Transaction;
import com.finscope.model.Transaction.TransactionType;
import com.finscope.model.User;
import com.finscope.model.Category;
import com.finscope.dao.CategoryDao;
import com.finscope.dao.TransactionDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionDao transactionDao;
    private final CategoryDao categoryDao;
    // Fetch all transactions for the currently logged-in user.
    // The @AuthenticationPrincipal automatically securely injects the user who made the request.
    @GetMapping
    public List<Transaction> getAll(@AuthenticationPrincipal User user) {
        return transactionDao.findByUserIdOrderByDateDesc(user.getId());
    }

    // Filter transactions by date range or specific type (Income/Expense)
    @GetMapping("/filter")
    public List<Transaction> filter(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
            
        // If both start and end dates are provided, fetch transactions within that window
        if (start != null && end != null) {
            return transactionDao.findByUserIdAndDateBetweenOrderByDateDesc(
                    user.getId(), LocalDate.parse(start), LocalDate.parse(end));
        }
        
        // If a specific type is requested (e.g., "EXPENSE"), filter by that type
        if (type != null) {
            return transactionDao.findByUserIdAndTypeOrderByDateDesc(
                    user.getId(), TransactionType.valueOf(type.toUpperCase()));
        }
        
        // Fallback: return everything if no filters matched
        return getAll(user);
    }
    // Add a new transaction record for the logged-in user
    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        Transaction tx = new Transaction();
        
        // Securely tie the transaction to the user making the request (prevents assigning to someone else)
        tx.setUser(user);
        
        // Map the required fields
        tx.setAmount(new BigDecimal(body.get("amount").toString()));
        tx.setType(TransactionType.valueOf(body.get("type").toString().toUpperCase()));
        tx.setDescription(body.get("description") != null ? body.get("description").toString() : "");
        tx.setDate(LocalDate.parse(body.get("date").toString()));
        
        // Map optional fields if they exist
        if (body.get("note") != null) tx.setNote(body.get("note").toString());
        if (body.get("paymentMethod") != null) tx.setPaymentMethod(body.get("paymentMethod").toString());
        if (body.get("tags") != null) tx.setTags(body.get("tags").toString());
        
        // Link the category if a category ID was provided
        if (body.get("categoryId") != null) {
            categoryDao.findById(Long.parseLong(body.get("categoryId").toString()))
                    .ifPresent(tx::setCategory);
        }
        
        return ResponseEntity.ok(transactionDao.save(tx));
    }
    // Modify an existing transaction. We first check if it belongs to the user.
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@AuthenticationPrincipal User user,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        return transactionDao.findById(id)
                // SECURITY CHECK: Ensure the logged-in user actually owns this transaction
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .map(tx -> {
                    // Update only the fields that were provided in the request
                    if (body.get("amount") != null) tx.setAmount(new BigDecimal(body.get("amount").toString()));
                    if (body.get("type") != null) tx.setType(TransactionType.valueOf(body.get("type").toString().toUpperCase()));
                    if (body.get("description") != null) tx.setDescription(body.get("description").toString());
                    if (body.get("date") != null) tx.setDate(LocalDate.parse(body.get("date").toString()));
                    if (body.get("note") != null) tx.setNote(body.get("note").toString());
                    if (body.get("paymentMethod") != null) tx.setPaymentMethod(body.get("paymentMethod").toString());
                    if (body.get("tags") != null) tx.setTags(body.get("tags").toString());
                    
                    if (body.get("categoryId") != null) {
                        categoryDao.findById(Long.parseLong(body.get("categoryId").toString()))
                                .ifPresent(tx::setCategory);
                    }
                    
                    return ResponseEntity.ok(transactionDao.save(tx));
                })
                // If the transaction wasn't found or doesn't belong to the user, return 404
                .orElse(ResponseEntity.notFound().build());
    }
    // Remove a transaction from the database
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return transactionDao.findById(id)
                // SECURITY CHECK: Ensure the logged-in user actually owns this transaction
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .map(t -> { 
                    transactionDao.delete(t); 
                    return ResponseEntity.noContent().build(); 
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
