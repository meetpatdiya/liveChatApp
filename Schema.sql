create table users(
    `id` int primary key auto_increment,
    `name` varchar(50) not null unique,
    `email` varchar(50) not null unique,
    `password` varchar(255) not null,
    `avatar` varchar(500),
    `is_online` tinyint(1) default 0,
    `last_seen` timestamp null,
    `created_at` timestamp default current_timestamp()
);
create table conversations(
    `id` int primary key auto_increment,
    `type` enum("private","group"),
    `group_name` varchar(50),
    `group_avatar` varchar(500),
    `created_by` int not null,
    `created_at` timestamp default current_timestamp(),
    constraint `created_by_cns` FOREIGN KEY(`created_by`) REFERENCES `users`(`id`)
);
create table conversation_members(
    `id` int primary key auto_increment,
    `conversation_id` int not null,
    `user_id` int not null,
    `joined_at` timestamp default current_timestamp(),
    `cleared_at`timestamp null,
    constraint `cnv_mem_cnv` FOREIGN KEY(`conversation_id`) REFERENCES `conversations`(`id`),
    constraint `cnv_mem_usr` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);
create table messages(
    `id` int primary key auto_increment,
    `conversation_id` int not null,
    `sender_id` int not null,
    `message` text not null ,
    `message_type` enum('text','image','file') default 'text',
    `created_at`  timestamp default current_timestamp(),
    constraint `msg_cnv_id` FOREIGN KEY(`conversation_id`) REFERENCES `conversations`(`id`),
    constraint `msg_snd_id` FOREIGN KEY(`sender_id`) REFERENCES `users`(`id`)
);
create table message_status(
    `id` int primary key auto_increment,
    `message_id` int not null,
    `user_id` int not null,
    `status` enum('sent','delivered','read') default 'sent',
    `seen_at` timestamp,
    constraint `msg_sts_msg` FOREIGN KEY(`message_id`) REFERENCES `messages`(`id`),
    constraint `msg_sts_usr` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);
CREATE TABLE user_blocks (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `blocker_id` INT NOT NULL,
    `blocked_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`blocker_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`blocked_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    UNIQUE (`blocker_id`, `blocked_id`),
    CHECK (`blocker_id` <> `blocked_id`)
);
CREATE TABLE message_reactions (
    `message_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `reaction` VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    UNIQUE(`message_id`, `user_id`)
);
CREATE TABLE message_mentions(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `message_id` INT NOT NULL,
    `mentioned_user_id` INT NOT NULL,
    FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`mentioned_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
)
CREATE TABLE notification(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `sender_id` INT NOT NULL,
    `type` enum("mention","reaction"),
    `message_id` INT,
    `conversation_id` INT,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE
)