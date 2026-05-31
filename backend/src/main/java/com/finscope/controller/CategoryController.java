package com.finscope.controller;

import com.finscope.model.Category;
import com.finscope.model.User;
import com.finscope.dao.CategoryDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryDao categoryDao;

    @GetMapping
    public List<Category> getAll(@AuthenticationPrincipal User user) {
        return categoryDao.findAvailableForUser(user.getId());
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        Category cat = new Category();
        cat.setName(body.get("name").toString());
        cat.setIcon(body.get("icon") != null ? body.get("icon").toString() : "tag");
        cat.setColor(body.get("color") != null ? body.get("color").toString() : "#4f9cf9");
        cat.setType(Category.CategoryType.valueOf(
                body.get("type") != null ? body.get("type").toString().toUpperCase() : "EXPENSE"));
        cat.setUser(user);
        cat.setIsDefault(false);
        return ResponseEntity.ok(categoryDao.save(cat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return categoryDao.findById(id)
                .filter(c -> c.getUser() != null && c.getUser().getId().equals(user.getId()))
                .map(c -> { categoryDao.delete(c); return ResponseEntity.noContent().build(); })
                .orElse(ResponseEntity.notFound().build());
    }
}
