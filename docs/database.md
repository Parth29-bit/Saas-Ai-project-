# Supportly AI - Database Schemas

The database uses MongoDB with Mongoose ODM. It includes 14 collections:

1. `User`: Account details, hashed passwords, RBAC roles (`SUPER_ADMIN`, `ADMIN`, `AGENT`, `CUSTOMER`).
2. `Organization`: Organization profile, default SLA priority, AI assistant tuning settings.
3. `Ticket`: Ticket metadata, status lifecycle (`NEW`, `OPEN`, `PENDING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), priority, SLA timer, CSAT feedback.
4. `Message`: Conversation messages, customer posts, public replies, and amber internal team notes.
5. `Customer`: Customer CRM directory, account tags, lifetime value, satisfaction scores.
6. `KnowledgeBaseArticle`: CMS Help Center articles with vector indexing for AI grounding.
7. `Category`: System ticket categories.
8. `Tag`: Color-coded ticket tags.
9. `Notification`: In-app alerts for assignments and SLA warnings.
10. `Automation`: IF-THEN rules for auto-assignment and priority routing.
11. `AIInteraction`: Audit log of AI prompts, completions, and token metrics.
12. `ActivityLog`: User action audit trail.
13. `ApiKey`: Developer API secret tokens.
14. `Subscription`: SaaS billing tier status (`FREE`, `PRO`, `ENTERPRISE`).
