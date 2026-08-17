# Supportly AI - Authentication & Security Architecture

## Token Storage
Sensitive JWT tokens are stored exclusively in **HttpOnly, Secure Cookies** with `sameSite: 'lax'` to protect against XSS and CSRF token theft.

## Role-Based Access Control (RBAC)
Supportly AI enforces 4-tier authorization across API routes and React views:
- `SUPER_ADMIN`: System-level platform control.
- `ADMIN`: Organization settings, agents, billing, automations, API keys.
- `AGENT`: Unified inbox, ticket copilot, internal notes, KB lookup.
- `CUSTOMER`: Help Center search, grounded AI bot, submit & track tickets.

## Password Safety
Passwords are hashed using `bcryptjs` with 10 salt rounds. Registration includes a real-time Password Strength meter (Weak, Fair, Good, Strong).
