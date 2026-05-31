package com.finscope.dao;

import com.finscope.model.Category;
import com.finscope.model.Category.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryDao extends JpaRepository<Category, Long> {

    // Global defaults + user's own categories
    @Query("SELECT c FROM Category c WHERE c.isDefault = true OR c.user.id = :userId")
    List<Category> findAvailableForUser(@Param("userId") Long userId);

    List<Category> findByUserIdOrderByNameAsc(Long userId);

    List<Category> findByIsDefaultTrueAndType(CategoryType type);
}
