USE member;

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
      `member_id` BIGINT NOT NULL  AUTO_INCREMENT,
      `email` VARCHAR(100) NOT NULL,
      `name` VARCHAR(100) NOT NULL,
      `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
      `social_type` VARCHAR(100) NOT NULL,
      `social_id` VARCHAR(100) NOT NULL,
      `created_at` DATETIME NOT NULL,
      `updated_at` DATETIME NULL,
      `last_login_date` DATETIME NULL,
      `role` VARCHAR(20) NOT NULL,
      PRIMARY KEY (`member_id`)
);
