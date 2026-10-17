# MMAX – Team & Task Management System

MMAX is a React-based team and task management application designed to organize employees, teams, and tasks through role-based dashboards. The application provides separate interfaces for administrators, team leaders, and employees, with shared layouts and protected routes.

## 🚀 Features

### 🔐 Authentication
- Login and signup pages.
- Form validation for required fields and email format.
- Authentication state management using React Context API.
- Persistent user information using `localStorage`.
- Role-based navigation after login.
- Protected routes for authorized roles.

### 👨‍💼 Admin Dashboard
- Access to the admin dashboard.
- Team management.
- Employee management.
- Team details and employee task views.
- Shared admin layout with sidebar navigation.

### 👥 Team Leader Dashboard
- Dedicated team leader dashboard.
- Task management interface.
- Separate layout and navigation for team leaders.

### 🧑‍💻 Employee Dashboard
- Dedicated employee dashboard.
- Personal task management page.
- Separate layout and navigation for employees.

### 🧭 Navigation & Layout
- React Router for client-side navigation.
- Nested routes using `Outlet`.
- Reusable sidebar and layout components.
- Role-based access checks using `ProtectedRoute`.

## 🛠️ Technologies Used

- React.js – User interface development.
- Vite – Development server and build tooling.
- JavaScript (ES6+) – Application logic.
- React Router DOM – Routing and navigation.
- Axios – HTTP requests to the backend API.
- CSS – Page layouts and styling.
- Context API – Shared authentication state.
- LocalStorage – Persistence of user information.
- JSON Server – Local mock REST API and data storage.
- Recharts – Data visualization and charts.

## 📂 Project Structure

```text
MMAX/
├── public/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── AuthContextValue.js
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Login/
│   │   ├── Signup/
│   │   ├── admin/
│   │   ├── lead/
│   │   └── employee/
│   ├── App.jsx
│   └── main.jsx
├── db.json
├── package.json
└── README.md
```

*Note: This is a simplified overview of the project structure.*

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd MMAX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the JSON Server

If your `db.json` file is in the project root and JSON Server is installed, run:

```bash
npx json-server --watch db.json --port 8000
```

The local API should be available at:

```text
http://localhost:8000
```

For example, the users endpoint may be:

```text
http://localhost:8000/users
```

### 4. Start the React development server

Open another terminal in the project directory and run:

```bash
npm run dev
```

Open the local URL displayed in the terminal to use the application.

## 🔄 Application Workflow

1. A user opens the login page.
2. The application validates the form input.
3. The login page retrieves user records from the local API and checks the supplied credentials.
4. The application stores the logged-in user's information through the authentication context.
5. The user is redirected to the appropriate dashboard based on their role.
6. `ProtectedRoute` checks whether the user is authenticated and has an allowed role.
7. Shared layouts render the sidebar and display the selected page through React Router's `Outlet`.
8. Logging out clears the stored user information and authentication state.

## 🧠 Key Concepts Practiced

- React functional components and hooks.
- `useState`, `useContext`, and custom hooks.
- React Context API and shared state.
- Controlled forms and validation.
- Async/await and Axios API requests.
- JavaScript array methods such as `find()`.
- LocalStorage and JSON serialization.
- React Router nested routes and dynamic route parameters.
- Reusable components and shared layouts.
- Role normalization and access checks.
- CSS Flexbox and page layout organization.

## 🔒 Security Note

This project currently uses a local JSON Server and client-side authentication logic for learning and development. It is not production-ready authentication.

A production implementation should use server-side credential verification, securely hashed passwords, appropriate session or token handling, and server-enforced authorization for protected operations.

## 🎯 Project Goal

The goal of MMAX is to practice building a multi-role React application with reusable components, structured routing, authentication state management, API integration, and separate dashboards for administrators, team leaders, and employees.