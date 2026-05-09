-- Migration: AUTHOR → REPORTER
-- Run this SQL BEFORE running `npx prisma db push` or `prisma migrate deploy`
-- This safely renames the enum value in MySQL

-- Step 1: Temporarily allow BOTH values
ALTER TABLE `User` MODIFY COLUMN `role` ENUM('ADMIN','AUTHOR','REPORTER','RESEARCH_AUTHOR') NOT NULL DEFAULT 'REPORTER';

-- Step 2: Update existing AUTHOR rows to REPORTER
UPDATE `User` SET `role` = 'REPORTER' WHERE `role` = 'AUTHOR';

-- Step 3: Remove the AUTHOR enum value
ALTER TABLE `User` MODIFY COLUMN `role` ENUM('ADMIN','REPORTER','RESEARCH_AUTHOR') NOT NULL DEFAULT 'REPORTER';
