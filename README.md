<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:0ea5e9&height=300&section=header&text=StaffSync&fontSize=90&fontAlignY=35&desc=Next-Gen%20Employee%20Management%20Platform&descAlignY=55&descAlign=60&fontColor=ffffff" alt="StaffSync Header Banner" width="100%" />

  <p align="center">
    <strong>A comprehensive, full-stack application designed to streamline internal company workflows.</strong>
  </p>

  <p align="center">
    <a href="#-powerful-features">Features</a>
    ·
    <a href="#-the-technology-stack">Tech Stack</a>
    ·
    <a href="#%EF%B8%8F-installation--getting-started">Installation</a>
    ·
    <a href="#-api-architecture--endpoints">API Endpoints</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<hr />

## ✨ Powerful Features

StaffSync takes the headache out of internal HR tasks, allowing your organization to focus on what matters most.

### 🔐 Role-Based Access Control (RBAC)
Experience a tailored interface depending on your organizational role:
- 👑 **Admin:** Master control over the system, allowing user management and overarching visibility on all operations.
- 🧑‍💼 **Manager:** Dedicated dashboard to review, approve, or reject team leave and reimbursement requests with absolute clarity.
- 👨‍💻 **Employee:** Intuitive portal to submit requests, track progress in real-time, and manage personal records.

### 📅 Advanced Leave Management
Say goodbye to complex spreadsheets.
- Apply for various leave types (Sick, Casual, Annual) in seconds.
- Multi-step status tracking (Pending → Approved/Rejected).
- Managers can provide detailed feedback/comments on resolutions.

### 💵 Seamless Reimbursement Tracking
Fast-track employee expenses.
- Submit digital expense forms instantly.
- Secure attachment integration for receipt handling.
- Managers process requests efficiently through their streamlined dashboard.

### 🎨 Modern UI/UX Elements
- **🌗 Dark Mode Integration:** First-class dark/light theme support to reduce eye strain.
- **⚡ Real-Time Responsiveness:** Dynamic React-based interface ensures instant feedback on every click.
- **📱 Fully Responsive:** Works perfectly on desktops, tablets, and mobile devices.

---

## 🚀 The Technology Stack

StaffSync is built on a robust, modern MERN architecture.

<div align="center">
<table>
  <tr>
    <td align="center" width="50%">
      <h3>Frontend Engine</h3>
      <p><b>React 19</b> paired with <b>Vite</b> for lightning-fast HMR and optimized builds. Styled dynamically utilizing <b>Tailwind CSS</b> for modern, utility-first design patterns.</p>
    </td>
    <td align="center" width="50%">
      <h3>Backend Core</h3>
      <p>A high-performance <b>Node.js & Express</b> server architecture securely connected to a flexible <b>MongoDB / Mongoose</b> database, authenticated via robust <b>JWT</b> protocols.</p>
    </td>
  </tr>
</table>
</div>

---

## 🛠️ Installation & Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16.0.0 or higher)
* [Git](https://git-scm.com/)
* A local or cloud MongoDB instance (e.g., MongoDB Atlas)

### 1. Project Cloning
```bash
git clone https://github.com/Tanishkraj2005/StaffSync.git
cd StaffSync
```

### 2. Backend Initialization
```bash
# Navigate to the server directory
cd backend

# Install all necessary packages
npm install

# Create environment configuration
touch .env
```
Inside the `.env` file, populate these core variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```
Launch the development server:
```bash
npm run dev
```

### 3. Frontend Initialization
Open a new terminal window:
```bash
# Navigate from root to frontend
cd frontend

# Install client packages
npm install

# Start the Vite development environment
npm run dev
```
🎉 **Success!** Open your browser to `http://localhost:5173`.

---

## 🌐 API Architecture & Endpoints

<details>
<summary><b>Click to expand API Route Documentation</b></summary>

| HTTP Method | Route Endpoint | Purpose | Authorization Level |
|-------------|----------------|---------|---------------------|
| `POST` | `/api/auth/register` | Create a new system user | Public |
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT | Public |
| `GET` | `/api/users/me` | Fetch active user context | Private (Token Req.) |
| `POST` | `/api/leaves` | Submit new leave request | 👨‍💻 Employee Only |
| `GET` | `/api/leaves` | Fetch requests (Contextual) | 🔒 Private |
| `POST` | `/api/reimbursements` | Submit expense claim | 👨‍💻 Employee Only |
| `GET` | `/api/reimbursements` | Fetch expenses (Contextual)| 🔒 Private |

</details>

---

## 🤝 Community & Contributions

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/Tanishkraj2005/StaffSync/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/IncredibleFeature`)
3. Commit your Changes (`git commit -m 'Add some IncredibleFeature'`)
4. Push to the Branch (`git push origin feature/IncredibleFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>If you found this project helpful, please give it a ⭐️!</p>
  <p>Designed and Built by <b>Tanishk Raj</b> & Contributors.</p>
</div>
