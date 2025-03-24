USE member;

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
      `user_id` BIGINT NOT NULL,
      `email` VARCHAR(100) NOT NULL,
      `name` VARCHAR(100) NOT NULL,
      `password` VARCHAR(255) NOT NULL,
      `user_type` VARCHAR(10) NULL,
      `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
      `social_type` VARCHAR(100) NOT NULL,
      `social_id` VARCHAR(100) NOT NULL,
      `created_at` DATETIME NOT NULL,
      `updated_at` DATETIME NULL,
      `last_login_date` DATETIME NULL,
      PRIMARY KEY (`user_id`)
);
