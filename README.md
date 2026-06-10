# Live Chat Application

## Overview

This is a real-time chat application built using the MERN-style stack with MySQL as the database. The project is currently under development and focuses on providing real-time messaging, online/offline user status tracking, and conversation management.

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* MySQL

## Features

* User registration and authentication
* Real-time messaging using Socket.IO
* One-to-one conversations
* Online/offline status tracking
* Last seen functionality
* Conversation management
* Message delivery tracking
* Responsive user interface

## Database Structure

### users

Stores user information.

### conversations

Stores conversation details.

### conversation_members

Stores users participating in conversations.

### messages

Stores chat messages.

### message_status

Stores message delivery and read status.

## Project Structure

```text
project/
│
├── client/
│   ├── src/
│   |     ├── assets/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── .env
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` folder and configure:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chatapp

JWT_SECRET=your_secret_key
```

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
cd client
npm run dev
```

## Current Status

🚧 This project is actively under development. New features and improvements are being added continuously.

## Future Improvements

* Group chat support
* Message reactions
* Typing indicators
* File and image sharing
* Voice messages
* Push notifications
* Video and audio calling

## Author

Meet Patadiya