# 🚀 Supportly AI — AI-Powered Customer Support Platform

> **AI-powered customer support, built for modern teams.**

Supportly AI is a production-quality, modern full-stack SaaS platform designed for enterprise support operations. It integrates AI-assisted reply drafting, ticket workflow management, 4-tier role-based access control (Admin, Agent, Customer), a customer-facing Knowledge Base, real-time analytics, SLA timers, and automated rule processing.

---

## ✨ Core Features & Highlights

- 🤖 **AI Support Copilot (Gemini Powered + Mock Fallback)**:
  - **1-Click Smart Replies**: Generates contextually grounded answers using KB articles.
  - **Auto-Summarization**: Distills long ticket threads into concise bulleted key points.
  - **Sentiment & Urgency Scoring**: Detects customer emotion (`Frustrated`, `Negative`, `Neutral`, `Positive`) and recommends ticket priority.
  - **Tone Rewriter & Translator**: Polish replies into professional tone, make friendlier, shorten, or translate to 10+ languages.
  - **Safety Guardrail**: Strict human-in-the-loop requirement for destructive actions.
- 📥 **Unified Support Inbox (3-Pane Layout)**:
  - Filter queues: *All, Unassigned, Assigned to Me, Urgent, Resolved*.
  - Rich conversation timeline with public customer replies vs **Amber Private Team Notes**.
  - SLA breach countdown timers and 1-click agent reassignment.
- 🏢 **4-Tier Role-Based Access Control (RBAC)**:
  - **Super Admin**: Platform-level control over all organizations, system settings, global AI models.
  - **Organization Admin**: Manage agents, ticket rules, customer directory, Knowledge Base CMS, Analytics, API Keys.
  - **Support Agent**: View inbox, process assigned tickets, post public replies & internal notes, use AI copilot.
  - **Customer**: Submit tickets, track status, interact with grounded AI chat widget, search public Help Center (`/help`).
- ⚡ **1-Click Demo Role Switcher**:
  - Top bar dropdown allowing instant switching between Admin, Agent, and Customer accounts for rapid testing.
- 📊 **Advanced Analytics & Visual Reporting (Recharts)**:
  - 6 KPI stat cards: Total Tickets, Open Tickets, Resolved Tickets, Avg Response Time, CSAT Score, AI Resolution Rate.
  - Interactive charts: Ticket Volume Over Time, SLA Compliance Area Chart, Issue Category Breakdown, Agent Leaderboard.
- ⚙️ **Automations Engine**:
  - Rule builder for IF-THEN conditions (e.g. *IF Priority = Urgent THEN Assign Senior Agent*; *IF contains "refund" THEN Category = Billing*).
- 🔐 **Enterprise Security & Architecture**:
  - JWT tokens stored in **HttpOnly, Secure Cookies** (no sensitive tokens in `localStorage`).
  - Password hashing with `bcryptjs` + Password Strength Meter.
  - Zero-config execution: Connects to MongoDB or auto-starts embedded `mongodb-memory-server` fallback.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Framer Motion |
| **State Management** | Zustand (Global Session & Theme State), Axios (API Client) |
| **Backend API** | Node.js, Express.js (TypeScript REST Architecture) |
| **Database** | MongoDB with Mongoose ODM + Embedded MongoMemoryServer |
| **Security** | Helmet, CORS, Express Rate Limiter, Zod Validation, HttpOnly Cookies |
| **AI Integration** | Google Gemini AI (`AI_API_KEY`, `AI_MODEL`) + Intelligent Fallback Engine |

---

## 🚀 Quick Start & Local Installation

### Prerequisites
- Node.js v18+ and npm installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/supportly-ai.git
cd supportly-ai

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Seed Database with Realistic Demo Data
```bash
cd ../backend
npm run seed
```

### 3. Launch Application Dev Servers
```bash
# Start backend REST API server (Port 5000)
cd backend && npm run dev

# In a separate terminal, start Vite React frontend (Port 5173)
cd frontend && npm run dev
```

Open **`http://localhost:5173`** in your browser!

---

## 🔑 Demo Account Credentials

Use the **1-Click Demo Switcher** in the top navigation bar or log in with:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Org Admin** | `admin@supportly.ai` | `password123` | Full Admin Dashboard & Settings |
| **Support Agent** | `agent@supportly.ai` | `password123` | Inbox, Copilot Workspace, Ticket Queue |
| **Customer** | `customer@supportly.ai` | `password123` | Customer Portal & Support Help Center |

---

## 📂 Monorepo Structure

```text
supportly-ai/
├── frontend/                   # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Primitives (Button, Modal, Card, Badge, etc.)
│   │   ├── pages/              # Landing, Login, Register, Onboarding, Dashboard, Inbox, Tickets, AI Workspace, Analytics, Settings, HelpCenter
│   │   ├── services/           # Axios API Client
│   │   ├── store/              # Zustand Auth & Theme Stores
│   │   └── types/              # TypeScript Definitions
├── backend/                    # Express REST API Backend
│   ├── src/
│   │   ├── config/             # DB & Server Config
│   │   ├── controllers/        # Auth, Ticket, Message, KB, AI, Customer, Analytics, Automation, Team, Settings
│   │   ├── middleware/         # Auth JWT, RBAC Guard, Rate Limiter, Error Handler, Zod Validator
│   │   ├── models/             # 14 Mongoose Models (User, Ticket, KBArticle, Customer, Automation, etc.)
│   │   ├── routes/             # REST Endpoints under /api/v1/*
│   │   ├── services/           # AI Copilot Service & Automations Rule Engine
│   │   └── utils/              # Seed Script
├── docs/                       # Architecture, API, Database, Auth & Deployment Guides
├── README.md
└── package.json
```

---

## 📄 License
MIT License. Created for Supportly AI.
