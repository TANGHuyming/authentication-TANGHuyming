# Homework 8: Authentication

This is a small Express.js authentication demo built with Handlebars, sessions, signed cookies, and a protected profile page.

## Overview

The application provides a basic login flow using hard-coded user accounts. After a successful login, the user session is stored with `express-session`, and the profile page becomes accessible. If a visitor tries to access the profile page without logging in, they are redirected to the login page.

The app also includes a light/dark theme toggle stored in a signed cookie and simple flash messages for login success or failure.

## Features

- Login form with username and password
- Session-based authentication
- Protected `/profile` route
- Logout route that destroys the session
- Flash messages for login status
- Light/dark theme toggle using a signed cookie
- Custom `404` and `500` pages

## Tech Stack

- Node.js
- Express
- Express Handlebars
- express-session
- cookie-parser
- dotenv

## Project Structure

```text
homework-8-authentication/
├── app.js
├── package.json
├── .env
├── public/
│   └── style.css
└── views/
	├── layouts/
	│   └── main.handlebars
	├── partials/
	│   ├── footer.handlebars
	│   └── header.handlebars
	├── 404.handlebars
	├── 500.handlebars
	├── home.handlebars
	├── login.handlebars
	└── profile.handlebars
```

## Installation

1. Open a terminal in this project folder.
2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following value:

```env
SECRET=your_session_secret
```

This secret is used for:

- signing cookies
- securing the session middleware

## Run the App

Start the server with:

```bash
node app.js
```

The server runs on:

```text
http://localhost:3000
```

## Demo Accounts

Use one of these built-in accounts to log in:

| Username | Password |
| --- | --- |
| admin | password123 |
| student_dev | dev_password |

## Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Home page |
| GET | `/login` | Login form |
| POST | `/login` | Authenticates a user |
| GET | `/profile` | Protected profile page |
| GET | `/logout` | Logs out the user and clears the session |
| GET | `/toggle-theme` | Toggles between light and dark mode |

## Authentication Flow

1. The user visits `/login`.
2. The form submits a username and password to `POST /login`.
3. If the credentials match one of the hard-coded users, the app stores that user in the session.
4. The user is redirected to `/profile`.
5. If the credentials are invalid, the user is redirected back to `/login` with an error message.
6. Visiting `/logout` destroys the session and redirects the user to the login page.
