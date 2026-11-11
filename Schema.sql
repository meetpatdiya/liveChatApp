CREATE TABLE users (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(500),
    `last_seen` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `privacy` ENUM('private', 'public') DEFAULT NULL,
    `type` ENUM('direct', 'group') DEFAULT 'direct',
    `group_name` VARCHAR(50),
    `group_avatar` VARCHAR(500),
    `created_by` INT NOT NULL,
    `pinned_message_id` INT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `created_by_cns` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
);

CREATE TABLE conversation_members (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `cleared_at` TIMESTAMP NULL,
    CONSTRAINT `cnv_mem_cnv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`),
    CONSTRAINT `cnv_mem_usr` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE messages (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `conversation_id` INT NOT NULL,
    `sender_id` INT NOT NULL,
    `message` TEXT NOT NULL,
    `message_type` ENUM('text', 'image', 'file', 'audio') DEFAULT 'text',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `msg_cnv_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`),
    CONSTRAINT `msg_snd_id` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`)
);

ALTER TABLE conversations
    ADD CONSTRAINT `fk_pinned_message` FOREIGN KEY (`pinned_message_id`) REFERENCES `messages`(`id`) ON DELETE SET NULL;

CREATE TABLE message_status (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `message_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `status` ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
    `seen_at` TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT `msg_sts_msg` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`),
    CONSTRAINT `msg_sts_usr` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE user_blocks (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `blocker_id` INT NOT NULL,
    `blocked_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_blocks_blocker` FOREIGN KEY (`blocker_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_blocks_blocked` FOREIGN KEY (`blocked_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE (`blocker_id`, `blocked_id`),
    CHECK (`blocker_id` <> `blocked_id`)
);

CREATE TABLE message_reactions (
    `message_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `reaction` VARCHAR(20) NOT NULL,
    CONSTRAINT `fk_reactions_message` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE (`message_id`, `user_id`)
);

CREATE TABLE message_mentions (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `message_id` INT NOT NULL,
    `mentioned_user_id` INT NOT NULL,
    CONSTRAINT `fk_mentions_message` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mentions_user` FOREIGN KEY (`mentioned_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE notification (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `sender_id` INT NOT NULL,
    `type` ENUM('mention', 'reaction'),
    `message_id` INT,
    `conversation_id` INT,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    CONSTRAINT `fk_notification_sender` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
    CONSTRAINT `fk_notification_message` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE
);
