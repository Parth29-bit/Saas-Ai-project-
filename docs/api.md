# Supportly AI - REST API Documentation

All API requests are prefixed with `/api/v1`. Standard responses return JSON formatted as:
```json
{
  "success": true,
  "data": {}
}
```

## Authentication & Onboarding
- `POST /api/v1/auth/register`: Create organization & admin user.
- `POST /api/v1/auth/login`: Authenticate & issue HttpOnly JWT cookie.
- `POST /api/v1/auth/logout`: Revoke session cookie.
- `GET /api/v1/auth/me`: Fetch authenticated user profile.
- `POST /api/v1/auth/demo-switch`: 1-click role switcher for instant testing (`ADMIN`, `AGENT`, `CUSTOMER`).

## Ticket Management
- `GET /api/v1/tickets`: Query tickets (supports filters: `status`, `priority`, `queue`, `search`).
- `GET /api/v1/tickets/:id`: Fetch ticket details with conversation thread.
- `POST /api/v1/tickets`: Create new ticket (triggers AI triage & automations).
- `PATCH /api/v1/tickets/:id`: Update status, priority, category, or assigned agent.

## AI Copilot Services
- `POST /api/v1/ai/generate-reply`: Generate KB-grounded response draft.
- `POST /api/v1/ai/summarize`: Distill conversation thread into bullet points.
- `POST /api/v1/ai/sentiment`: Analyze sentiment, urgency score, and priority recommendation.
- `POST /api/v1/ai/chat`: Customer self-serve AI chatbot query.
- `POST /api/v1/ai/rewrite`: Rewrite text (`professional`, `shorter`, `friendlier`, `translate`).
