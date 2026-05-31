-- =========================================
--   FinScope Database Schema
--   MySQL 8.x
-- =========================================

CREATE DATABASE IF NOT EXISTS finscope_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finscope_db;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  UNIQUE NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('USER','ADMIN') DEFAULT 'USER',
    phone       VARCHAR(20),
    currency    VARCHAR(10)   DEFAULT 'INR',
    avatar      VARCHAR(255),
    is_active   BOOLEAN       DEFAULT TRUE,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    icon        VARCHAR(50),
    color       VARCHAR(20),
    type        ENUM('EXPENSE','INCOME') DEFAULT 'EXPENSE',
    user_id     BIGINT NULL,
    is_default  BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT        NOT NULL,
    category_id  BIGINT,
    amount       DECIMAL(12,2) NOT NULL,
    type         ENUM('EXPENSE','INCOME') NOT NULL,
    description  VARCHAR(500),
    date         DATE          NOT NULL,
    note         TEXT,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- BUDGETS
CREATE TABLE IF NOT EXISTS budgets (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT        NOT NULL,
    category_id  BIGINT,
    name         VARCHAR(100),
    amount       DECIMAL(12,2) NOT NULL,
    month        INT           NOT NULL,
    year         INT           NOT NULL,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- DEFAULT CATEGORIES (systemwide) ────
INSERT INTO categories (name, icon, color, type, user_id, is_default) VALUES
('Food & Dining',    'utensils',       '#ff6b6b', 'EXPENSE', NULL, TRUE),
('Transportation',   'car',            '#4ecdc4', 'EXPENSE', NULL, TRUE),
('Shopping',         'shopping-bag',   '#45b7d1', 'EXPENSE', NULL, TRUE),
('Entertainment',    'film',           '#96ceb4', 'EXPENSE', NULL, TRUE),
('Healthcare',       'heart',          '#feca57', 'EXPENSE', NULL, TRUE),
('Education',        'book',           '#ff9ff3', 'EXPENSE', NULL, TRUE),
('Bills & Utilities','zap',            '#54a0ff', 'EXPENSE', NULL, TRUE),
('Housing',          'home',           '#5f27cd', 'EXPENSE', NULL, TRUE),
('Travel',           'plane',          '#00d2d3', 'EXPENSE', NULL, TRUE),
('Others',           'more-horizontal','#c8d6e5', 'EXPENSE', NULL, TRUE),
('Salary',           'briefcase',      '#1dd1a1', 'INCOME',  NULL, TRUE),
('Freelance',        'code',           '#10ac84', 'INCOME',  NULL, TRUE),
('Investment',       'trending-up',    '#f368e0', 'INCOME',  NULL, TRUE),
('Business',         'bar-chart',      '#ee5a24', 'INCOME',  NULL, TRUE),
('Gift',             'gift',           '#ffd32a', 'INCOME',  NULL, TRUE);

-- ADMIN SEED USER
-- Default password: Admin@123  (BCrypt encoded)
INSERT INTO users (name, email, password, role, currency) VALUES
('Admin FinScope', 'admin@finscope.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN', 'INR');
-- NOTE: If login fails, regenerate via:
--   UPDATE users SET password = '<BCryptHash>' WHERE email='admin@finscope.com';
