# Supportly AI - System Architecture

Supportly AI is built using a modern full-stack decoupled architecture designed for high scalability, fault tolerance, and developer ergonomics.

## System Topology
```text
[ Browser / Client ] 
       │
       │ HTTP / HttpOnly Cookie JWT
       ▼
[ Vite + React 18 Single Page App (Port 5173) ]
       │
       │ Express REST API Middleware (Port 5000)
       ▼
[ Node.js Express TypeScript Engine ]
       ├── Auth Controller (bcrypt, JWT)
       ├── AI Service Abstraction (Gemini API + Mock Fallback)
       ├── Automations Engine (IF-THEN Rules)
       └── Mongoose ODM Layer
               │
               ▼
[ MongoDB Database (Embedded Memory Fallback / Atlas) ]
```

## Core Modules
1. **React Frontend**: Built with Vite, TypeScript, Tailwind CSS, Lucide icons, Recharts, and Zustand for state management.
2. **REST API Backend**: Node.js & Express server structured with Controllers, Services, Middleware, and Zod Validators.
3. **AI Copilot Service**: Clean abstraction layer supporting Google Gemini AI with fallback generators.
4. **Mongoose Database**: 14 decoupled models for Users, Organizations, Tickets, Messages, Knowledge Articles, Customers, Automations, Notifications, and Analytics.
