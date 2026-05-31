package com.finscope.controller;

import com.finscope.model.Budget;
import com.finscope.model.Transaction.TransactionType;
import com.finscope.model.User;
import com.finscope.dao.BudgetDao;
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
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetDao budgetDao;
    private final CategoryDao categoryDao;
    private final TransactionDao transactionDao;
    // Fetch all budget ceilings ever set by this user
    @GetMapping
    public List<Budget> getAll(@AuthenticationPrincipal User user) {
        return budgetDao.findByUserId(user.getId());
    }

    // Fetch the user's budgets for the CURRENT month, and calculate how much they have already spent
    @GetMapping("/current")
    public List<Map<String, Object>> getCurrentMonth(@AuthenticationPrincipal User user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        
        // Grab the budgets specifically for this month
        List<Budget> budgets = budgetDao.findByUserIdAndMonthAndYear(user.getId(), currentMonth, currentYear);

        // Transform the raw budget data into a richer format containing "spent" and "percentage"
        return budgets.stream().map(budget -> {
            BigDecimal amountSpent = BigDecimal.ZERO;
            
            // If the budget is tied to a specific category, calculate the total expenses in that category for this month
            if (budget.getCategory() != null) {
                amountSpent = transactionDao.sumByCategoryAndMonth(
                        user.getId(), budget.getCategory().getId(), currentMonth, currentYear);
            }
            
            // Build the response map for the frontend
            Map<String, Object> budgetDetails = new java.util.HashMap<>();
            budgetDetails.put("id", budget.getId());
            budgetDetails.put("name", budget.getName() != null ? budget.getName() : "");
            budgetDetails.put("category", budget.getCategory() != null ? budget.getCategory().getName() : "General");
            budgetDetails.put("categoryColor", budget.getCategory() != null ? budget.getCategory().getColor() : "#4f9cf9");
            budgetDetails.put("amount", budget.getAmount());
            budgetDetails.put("spent", amountSpent);
            
            // Safely calculate the percentage of the budget used (avoiding division by zero)
            BigDecimal percentageUsed = BigDecimal.ZERO;
            if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                percentageUsed = amountSpent
                        .multiply(BigDecimal.valueOf(100))
                        .divide(budget.getAmount(), 0, java.math.RoundingMode.HALF_UP);
            }
            budgetDetails.put("percentage", percentageUsed);
            
            return budgetDetails;
        }).toList();
    }
    // Set a new budget limit for a specific category and month
    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        Budget budget = new Budget();
        
        // Link the budget securely to the logged-in user
        budget.setUser(user);
        
        budget.setName(body.get("name") != null ? body.get("name").toString() : "");
        budget.setAmount(new BigDecimal(body.get("amount").toString()));
        budget.setMonth(Integer.parseInt(body.get("month").toString()));
        budget.setYear(Integer.parseInt(body.get("year").toString()));
        
        // Link the target category if one was provided
        if (body.get("categoryId") != null) {
            categoryDao.findById(Long.parseLong(body.get("categoryId").toString()))
                    .ifPresent(budget::setCategory);
        }
        
        return ResponseEntity.ok(budgetDao.save(budget));
    }
    // Modify an existing budget limit
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@AuthenticationPrincipal User user,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        return budgetDao.findById(id)
                // SECURITY CHECK: Ensure this budget actually belongs to the logged-in user
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .map(budget -> {
                    // Update the limit amount if provided
                    if (body.get("amount") != null) {
                        budget.setAmount(new BigDecimal(body.get("amount").toString()));
                    }
                    // Update the custom name if provided
                    if (body.get("name") != null) {
                        budget.setName(body.get("name").toString());
                    }
                    
                    return ResponseEntity.ok(budgetDao.save(budget));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    // Remove a budget limit
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return budgetDao.findById(id)
                // SECURITY CHECK: Only delete if the user owns it
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .map(budget -> { 
                    budgetDao.delete(budget); 
                    return ResponseEntity.noContent().build(); 
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
