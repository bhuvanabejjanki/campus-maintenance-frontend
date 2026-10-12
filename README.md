# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
- **Admin:** Users page to edit, deactivate/activate and delete accounts
- **Student:** edit pending requests; edit or delete your own comments
# Campus Maintenance System: Frontend

React web app for reporting and tracking campus maintenance issues.
Backend repository: https://github.com/bhuvanabejjanki/campus-maintenance-backend

## Features
- Login, student registration, forgot / reset password
- **Student:** report issues with an optional photo, edit pending requests, track status, comment
- **Admin:** see all requests, assign technicians, add technician accounts, manage users, delete requests
- **Technician:** see assigned requests, update status, comment
- Search, status filter, sort by date or priority
- Comments and status history on every request

## Tech stack
React (Vite), React Router, Axios, plain CSS

## Setup
1. Install Node.js 22 LTS (20.19 or newer also works).
2. Start the backend first (see the backend repository) so it runs on http://localhost:8080.
3. Then run:
```
   npm install
   npm run dev
```
4. Open http://localhost:5173

The API address is set in `src/api.js` (default `http://localhost:8080/api`).

## Demo accounts (created by the backend on first run)
| Role | Email | Password |
|---|---|---|
| Admin | admin@campus.edu | admin123 |
| Technician | tech@campus.edu | tech123 |

Students register from the sign-up page.

## Project structure
```
src/
├── main.jsx, App.jsx, api.js, AuthContext.jsx, index.css
├── components/   Navbar, RequestForm, RequestCard, EditRequestForm, CommentSection,
│                 RequestImage, TechnicianForm
└── pages/        Login, Register, ForgotPassword, ResetPassword, Dashboard, Users
```

## Author
[Your name], [college / course], [year]
