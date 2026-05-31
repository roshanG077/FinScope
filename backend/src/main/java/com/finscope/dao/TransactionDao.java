package com.finscope.dao;

import com.finscope.model.Transaction;
import com.finscope.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionDao extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(
            Long userId, LocalDate start, LocalDate end);

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumByUserAndTypeAndMonthAndYear(
            @Param("uid") Long userId,
            @Param("type") TransactionType type,
            @Param("month") int month,
            @Param("year") int year);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.category.id = :cid AND t.type = 'EXPENSE' " +
           "AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumByCategoryAndMonth(
            @Param("uid") Long userId,
            @Param("cid") Long categoryId,
            @Param("month") int month,
            @Param("year") int year);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = 'EXPENSE' AND YEAR(t.date) = :year AND MONTH(t.date) = :month " +
           "GROUP BY t.category.name")
    List<Object[]> expenseByCategory(@Param("uid") Long userId,
                                     @Param("month") int month,
                                     @Param("year") int year);

    @Query("SELECT MONTH(t.date), SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :uid AND t.type = :type AND YEAR(t.date) = :year " +
           "GROUP BY MONTH(t.date) ORDER BY MONTH(t.date)")
    List<Object[]> monthlyTrend(@Param("uid") Long userId,
                                @Param("type") TransactionType type,
                                @Param("year") int year);

    // Admin
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type")
    BigDecimal globalSum(@Param("type") TransactionType type);
}
