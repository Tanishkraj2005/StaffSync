# StaffSync - Employee Leave & Reimbursement Management System

![Banner Placeholder](https://via.placeholder.com/1200x400.png?text=StaffSync+-+Leave+%26+Reimbursement+Manager)

A comprehensive, full-stack application designed to streamline internal company workflows, including leave requests, reimbursement approvals, and employee management. Built with a modern tech stack focusing on scalability, security, and a seamless user experience.

## ✨ Features

- 🔐 **Role-Based Access Control (RBAC):** Three distinct roles with specific permissions:
  - **Admin:** Full control over users, leaves, and reimbursements.
  - **Manager:** Approve or reject leave and reimbursement requests for their team.
  - **Employee:** Apply for leaves and reimbursements, track request status.
- 📅 **Leave Management:** Easily apply for different types of leaves. Managers can review, approve, or reject these requests with comments.
- 💵 **Reimbursement Tracking:** Submit expenses along with proof documents. Managers can process reimbursements efficiently.
- 🌗 **Dark/Light Mode Options:** Built-in theming support for comfortable viewing at any time of day.
- ⚡ **Real-Time Data Flow:** Instant updates on request statuses.
- 🔒 **Secure Authentication:** JWT-based secure user authentication and bcrypt password hashing.

## 🚀 Tech Stack

### Frontend
- **React 19:** View library for building intuitive UIs.
- **Vite:** High-performance build tool and dev server.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development and fluid responsive design.
- **React Router DOM:** Application routing.
- **Axios:** Promise-based HTTP client for API requests.
- **Firebase:** Integrated for potential file storage (e.g., reimbursement receipts) and additional services.

### Backend
- **Node.js & Express.js:** Fast, scalable backend server infrastructure.
- **MongoDB & Mongoose:** NoSQL database for flexible and structured data relationship management.
- **JWT (JSON Web Tokens):** Secure route protection and user session management.
- **Bcrypt.js:** Robust password encryption.
- **Firebase Admin SDK:** Server-side Firebase integration.

## 📁 Project Structure

```text
Leave/
├── backend/                  # Node.js/Express backend
│   ├── config/               # Database and Firebase configuration
│   ├── controllers/          # Request handlers and business logic
│   ├── middleware/           # Custom middlewares (auth, error handling)
│   ├── models/               # Mongoose schemas (User, Leave, Reimbursement)
│   ├── routes/               # Express API routes
│   └── server.js             # Entry point for backend
│
└── frontend/                 # React frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Images, icons, global styles
    │   ├── components/       # Reusable UI components (ProtectedRoute, etc.)
    │   ├── context/          # React Context providers (Auth, Theme)
    │   ├── pages/            # View components (Login, Dashboards, AdminPanel)
    │   ├── services/         # API integration layer
    │   ├── App.jsx           # Main React component
    │   └── main.jsx          # Frontend entry point
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/Tanishkraj2005/StaffSync.git
cd StaffSync
```

### 2. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Setup Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints Overview

| Route | Method | Description | Access |
|-------|--------|-------------|--------|
| `/api/auth/register` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Authenticate user & get token | Public |
| `/api/users/me` | GET | Get current user profile | Private |
| `/api/leaves` | POST | Apply for a leave | Employee |
| `/api/leaves` | GET | Get leaves based on role | Private |
| `/api/reimbursements` | POST | Apply for reimbursement | Employee |
| `/api/reimbursements` | GET | Get all reimbursements | Private |

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
