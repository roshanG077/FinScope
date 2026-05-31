package com.finscope.config;

import com.finscope.dao.CategoryDao;
import com.finscope.dao.UserDao;
import com.finscope.model.Category;
import com.finscope.model.Category.CategoryType;
import com.finscope.model.User;
import com.finscope.model.User.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryDao categoryDao;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedInitialUsers();
        seedDefaultCategories();
    }

    private void seedInitialUsers() {
        // 1. Seed Admin
        java.util.Optional<User> adminOpt = userDao.findByEmail("admin@finscope.com");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            userDao.save(admin);
            System.out.println(">>> DatabaseSeeder: Successfully reset admin user password to Admin@123 inside MySQL.");
        } else {
            User admin = User.builder()
                    .name("Admin FinScope")
                    .email("admin@finscope.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .phone("+91 98765 43210")
                    .isActive(true)
                    .build();
            userDao.save(admin);
            System.out.println(">>> DatabaseSeeder: Successfully seeded admin user: admin@finscope.com with password Admin@123");
        }

        // 2. Seed Demo User
        java.util.Optional<User> demoOpt = userDao.findByEmail("demo@finscope.com");
        if (demoOpt.isPresent()) {
            User demo = demoOpt.get();
            demo.setPassword(passwordEncoder.encode("Demo@123"));
            userDao.save(demo);
            System.out.println(">>> DatabaseSeeder: Successfully reset demo user password to Demo@123 inside MySQL.");
        } else {
            User demo = User.builder()
                    .name("Demo User")
                    .email("demo@finscope.com")
                    .password(passwordEncoder.encode("Demo@123"))
                    .role(Role.USER)
                    .phone("+91 88888 88888")
                    .isActive(true)
                    .build();
            userDao.save(demo);
            System.out.println(">>> DatabaseSeeder: Successfully seeded demo user: demo@finscope.com with password Demo@123");
        }
    }

    private void seedDefaultCategories() {
        if (categoryDao.count() == 0) {
            List<Category> defaults = List.of(
                Category.builder().name("Food & Dining").icon("utensils").color("#ff6b6b").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Transportation").icon("car").color("#4ecdc4").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Shopping").icon("shopping-bag").color("#45b7d1").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Entertainment").icon("film").color("#96ceb4").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Healthcare").icon("heart").color("#feca57").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Education").icon("book").color("#ff9ff3").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Bills & Utilities").icon("zap").color("#54a0ff").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Housing").icon("home").color("#5f27cd").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Travel").icon("plane").color("#00d2d3").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Others").icon("more-horizontal").color("#c8d6e5").type(CategoryType.EXPENSE).isDefault(true).build(),
                Category.builder().name("Salary").icon("briefcase").color("#1dd1a1").type(CategoryType.INCOME).isDefault(true).build(),
                Category.builder().name("Freelance").icon("code").color("#10ac84").type(CategoryType.INCOME).isDefault(true).build(),
                Category.builder().name("Investment").icon("trending-up").color("#f368e0").type(CategoryType.INCOME).isDefault(true).build(),
                Category.builder().name("Business").icon("bar-chart").color("#ee5a24").type(CategoryType.INCOME).isDefault(true).build(),
                Category.builder().name("Gift").icon("gift").color("#ffd32a").type(CategoryType.INCOME).isDefault(true).build()
            );
            categoryDao.saveAll(defaults);
            System.out.println(">>> DatabaseSeeder: Successfully seeded default categories inside MySQL database.");
        }
    }
}
