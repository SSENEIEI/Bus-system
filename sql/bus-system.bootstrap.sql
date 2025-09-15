-- Bus-system fresh install schema (MariaDB/XAMPP friendly)
-- Use this for NEW setups via phpMyAdmin. All FKs are defined inline; no ALTER statements.
-- Idempotent-ish for empty DB (uses INSERT IGNORE for seeds). If tables already exist, prefer the code-based /api/init.

-- 0) Database
CREATE DATABASE IF NOT EXISTS `Bus-system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Bus-system`;

-- 1) Plants / Departments (create parent first)
CREATE TABLE IF NOT EXISTS plants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plant_id INT NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_plant_code (plant_id, code),
  KEY plant_idx (plant_id),
  CONSTRAINT dept_plant_fk FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

-- 2) Users (define full columns + FKs inline)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  is_super_admin TINYINT(1) NOT NULL DEFAULT 0,
  display_name VARCHAR(100) NULL,
  department VARCHAR(100) NULL,
  plant_id INT NULL,
  department_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY username (username),
  KEY users_plant_idx (plant_id),
  KEY users_department_idx (department_id),
  CONSTRAINT users_plant_fk FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE SET NULL,
  CONSTRAINT users_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) CHARSET=utf8mb4;

-- 3) Shifts / Depart Times
CREATE TABLE IF NOT EXISTS shifts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_th VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS depart_times (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shift_id INT NOT NULL,
  time TIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uniq_shift_time (shift_id, time),
  KEY shift_idx (shift_id),
  CONSTRAINT dt_shift_fk FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

-- 4) Routes
CREATE TABLE IF NOT EXISTS routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;

-- 5) Legacy tables (optional/back-compat)
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  vendor VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_product_vendor (name, vendor)
) CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;

-- 6) OT Counts
CREATE TABLE IF NOT EXISTS ot_counts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  the_date DATE NOT NULL,
  route_id INT NOT NULL,
  plant_id INT NOT NULL,
  department_id INT NOT NULL,
  shift_id INT NOT NULL,
  depart_time_id INT NOT NULL,
  count INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_count (the_date, route_id, plant_id, department_id, shift_id, depart_time_id),
  KEY date_idx (the_date),
  KEY otc_route_idx (route_id),
  KEY otc_plant_idx (plant_id),
  KEY otc_dept_idx (department_id),
  KEY otc_shift_idx (shift_id),
  KEY otc_dt_idx (depart_time_id),
  CONSTRAINT otc_route_fk FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  CONSTRAINT otc_plant_fk FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  CONSTRAINT otc_dept_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  CONSTRAINT otc_shift_fk FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
  CONSTRAINT otc_dt_fk FOREIGN KEY (depart_time_id) REFERENCES depart_times(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

-- 7) OT Locks
CREATE TABLE IF NOT EXISTS ot_locks (
  the_date DATE PRIMARY KEY,
  is_locked TINYINT(1) NOT NULL DEFAULT 1,
  locked_by_user_id INT NULL,
  locked_at DATETIME NULL,
  KEY otlock_user_idx (locked_by_user_id),
  CONSTRAINT otlock_user_fk FOREIGN KEY (locked_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) CHARSET=utf8mb4;

-- 8) Legacy additional tables
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  truck_number INT NOT NULL,
  department VARCHAR(100) NOT NULL,
  percentage INT NOT NULL,
  booking_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_booking_lookup (booking_date, product_id, truck_number),
  KEY user_id (user_id),
  KEY product_id (product_id),
  CONSTRAINT bookings_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT bookings_product_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

-- Removed legacy Around_thetruck table (unused)

-- 9) Seed data (optional)
INSERT IGNORE INTO plants (code, name) VALUES ('AC','AC'),('RF','RF'),('SSC','SSC');

INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'SAC','SAC' FROM plants p WHERE p.code='AC';
INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'AIO','AIO' FROM plants p WHERE p.code='AC';
INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'RF-A','RF-A' FROM plants p WHERE p.code='RF';
INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'RF-B','RF-B' FROM plants p WHERE p.code='RF';
INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'HR','HR' FROM plants p WHERE p.code='SSC';
INSERT IGNORE INTO departments (plant_id, code, name)
  SELECT p.id, 'SCM','SCM' FROM plants p WHERE p.code='SSC';

INSERT IGNORE INTO shifts (name_th, name_en) VALUES ('กะกลางวัน','Day Shift'),('กะกลางคืน','Night Shift');
INSERT IGNORE INTO depart_times (shift_id, time)
  SELECT s.id, '17:00:00' FROM shifts s WHERE s.name_th='กะกลางวัน';
INSERT IGNORE INTO depart_times (shift_id, time)
  SELECT s.id, '19:10:00' FROM shifts s WHERE s.name_th='กะกลางวัน';

-- Routes seed
SET @i = 0;
INSERT IGNORE INTO routes (name, display_order) VALUES
  ('คลองอุดม', (@i:=@i+1)),
  ('วิจิตรา', (@i:=@i+1)),
  ('สระแท่น', (@i:=@i+1)),
  ('นาดี', (@i:=@i+1)),
  ('ครัวอากู๋', (@i:=@i+1)),
  ('บ้านเลียบ', (@i:=@i+1)),
  ('สันติสุข', (@i:=@i+1)),
  ('ปราจีนบุรี', (@i:=@i+1)),
  ('สระแก้ว', (@i:=@i+1)),
  ('ดงน้อย', (@i:=@i+1));

-- Super admin seed (Password hash placeholder - replace via auth flow)
INSERT IGNORE INTO users (username, password, is_admin, is_super_admin, display_name)
VALUES ('adminga', '$2b$10$placeholderhash.................', 1, 1, 'Admin GA');
