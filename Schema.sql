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