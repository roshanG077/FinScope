package com.finscope.controller;

import com.finscope.model.Transaction.TransactionType;
import com.finscope.model.User;
import com.finscope.dao.TransactionDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final TransactionDao transactionDao;

    @GetMapping("/summary")
    public Map<String, Object> getSummary(@AuthenticationPrincipal User user) {
        int month = LocalDate.now().getMonthValue();
        int year  = LocalDate.now().getYear();

        BigDecimal income  = transactionDao.sumByUserAndTypeAndMonthAndYear(user.getId(), TransactionType.INCOME,  month, year);
        BigDecimal expense = transactionDao.sumByUserAndTypeAndMonthAndYear(user.getId(), TransactionType.EXPENSE, month, year);
        BigDecimal balance = income.subtract(expense);

        return Map.of(
                "totalIncome",  income,
                "totalExpense", expense,
                "netBalance",   balance,
                "month", month,
                "year", year
        );
    }

    @GetMapping("/category-breakdown")
    public List<Map<String, Object>> getCategoryBreakdown(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        if (month == 0) month = LocalDate.now().getMonthValue();
        if (year == 0) year = LocalDate.now().getYear();

        List<Object[]> rows = transactionDao.expenseByCategory(user.getId(), month, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(Map.of("category", row[0], "amount", row[1]));
        }
        return result;
    }

    @GetMapping("/monthly-trend")
    public Map<String, Object> getMonthlyTrend(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int year) {
        if (year == 0) year = LocalDate.now().getYear();

        List<Object[]> incomeRows  = transactionDao.monthlyTrend(user.getId(), TransactionType.INCOME, year);
        List<Object[]> expenseRows = transactionDao.monthlyTrend(user.getId(), TransactionType.EXPENSE, year);

        return Map.of("income", buildMonthlyMap(incomeRows),
                      "expense", buildMonthlyMap(expenseRows),
                      "year", year);
    }

    private Map<Integer, BigDecimal> buildMonthlyMap(List<Object[]> rows) {
        Map<Integer, BigDecimal> map = new LinkedHashMap<>();
        for (int i = 1; i <= 12; i++) map.put(i, BigDecimal.ZERO);
        for (Object[] row : rows) {
            map.put(((Number) row[0]).intValue(), (BigDecimal) row[1]);
        }
        return map;
    }
}
