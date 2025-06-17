# Lovable Project Summary (lov.md)

This document provides a high-level overview of the Morvo AI project's architecture, integrations, and recent issue resolutions, based on the latest project documentation.

---

## 1. Achieved Architecture Components

The project has a sophisticated and scalable architecture with the following key components in place:

### a. Multi-Agent System (CrewAI)
A 9-agent system is implemented, with one master agent and eight specialist agents:
- **Client Experience Agent (Master)**: Orchestrates all other agents and manages the user conversation.
- **Specialist Agents**: SEO, Social Media, Brand Monitoring, Web Analytics, Paid Advertising, Email Marketing, Content Management, and Competitor Analysis.
- Each agent has a specific role, LLM configuration (gpt-4o or gpt-4o-mini), and a dedicated set of tools.

### b. Supabase Backend
The database is fully provisioned on Supabase with a schema that supports:
- **User and Client Management**: Handles user authentication and client data.
- **Subscription Plans**: Manages different subscription tiers (Base, Pro, Enterprise).
- **Token Quotas**: Each client has a token quota (default 20,000 free tokens upon registration).
- **Profile Management**: Stores customer profile information gathered by the agents.
- **A2A Messaging**: Tables for agent-to-agent communication logs.

### c. FastAPI Application
A high-performance API layer built with FastAPI provides endpoints for:
- **Chat**: Handles real-time communication with the agent system.
- **Authentication**: Manages user sign-up and login.
- **Subscriptions**: Endpoints for managing subscription plans and payments.
- **Agent Information**: Provides details about available agents.

### d. Lovable Frontend
A responsive user interface built with React and TypeScript that includes:
- **Split-Screen Dashboard**: A modern interface with a chat panel and a dynamic hero section.
- **Mobile-Responsive Design**: Adapts to smaller screens with a tab-based navigation.
- **Real-time Chat**: Connects to the FastAPI backend for interactive conversations.
- **Component-Based Structure**: Well-organized components for chat, dashboard, and authentication.

### e. Subscription & Payment System
A complete subscription system is integrated, featuring:
- **Moyasar Payment Gateway**: For handling payments in SAR.
- **Subscription Tiers**: Different levels of access to agents and features.
- **Automated Webhooks**: To activate and manage subscriptions based on payment status.

---

## 2. Integration Points

The components are interconnected through the following integration points:

### a. Frontend ↔ Backend Communication
- The Lovable frontend communicates with the FastAPI backend via RESTful API calls.
- The primary API endpoint is `https://morvo-production.up.railway.app`.
- Key integrated endpoints include `/health`, `/v1/chat/test`, and `/v1/subscription/*`.

### b. Backend ↔ Supabase
- The FastAPI application uses the Supabase Python client to interact with the database.
- It handles user data, profile updates, and subscription status checks.
- A service layer is in place to manage database operations.

### c. Agent ↔ Tools & External APIs
- Specialist agents are equipped with tools that connect to external services like SEMrush, Google Analytics, Brand24, etc.
- These tools enable agents to fetch and process real-time data.

### d. Agent-to-Agent (A2A) Communication
- Agents communicate with each other using an HTTP-based protocol.
- The master agent delegates tasks to specialist agents and synthesizes their responses.

---

## 3. Latest Issues & Solutions

Based on the latest analysis documents, here are the most recent issues and their implemented or proposed solutions:

### a. Frontend & Connection Issues
- **Issue**: Fake client ID generation on the frontend, preventing memory persistence.
  - **Solution**: Updated `MorvoAIService.ts` to use the authenticated user's real ID from Supabase session.
- **Issue**: Chat functionality was buried inside a protected dashboard route, creating a poor user experience.
  - **Solution**: Added a direct `/chat` route and a `SimpleAuthWrapper` to allow immediate access after login.
- **Issue**: The registration page redirected to login instead of the chat/dashboard.
  - **Solution**: Updated the registration flow to redirect to `/chat` upon successful registration.

### b. Memory Persistence
- **Issue**: The system would ask for profile information (e.g., company name) repeatedly because it wasn't saving the user's answers.
  - **Solution**: Implemented a `_process_profile_answer` function in the agent logic. This function extracts the user's answer, saves it to the `customer_profiles` table in Supabase, and then proceeds to the next profile question.

### c. Authentication Mismatch
- **Issue**: The frontend was attempting to call authenticated endpoints without providing a token.
  - **Solution**: The recommended fix is to implement a full authentication flow where the frontend retrieves the JWT from the Supabase session and sends it as a Bearer token in the `Authorization` header for protected routes like `/v1/chat/message`.

This summary reflects the current state of the Morvo AI project, highlighting a robust architecture and a clear path to resolving outstanding frontend and integration issues. 