# Product Requirements Document: Daily Skill Log

**Author:** Lead Engineer & Co-Founder
**Version:** 1.0
**Status:** Finalized for MVP Launch

---

## 1. Overview & Vision

### 1.1. The Problem
In the tech industry, a developer's true value is not their resume; it's their ability to consistently learn, solve problems, and build. However, this "proof-of-work" is fragmented across GitHub commits, personal projects, and forum comments. There is no single, verifiable platform that showcases the *process* of growth, which is what recruiters and hiring managers are desperate to see.

### 1.2. The Solution
**Daily Skill Log** is a B2C2B platform that transforms the daily act of learning into a verifiable career asset.

*   **For Developers (The Community):** We provide a free, beautiful, and powerful suite of tools to log their daily work, connect with peers in real-time "Study Circles," and build a public reputation based on their contributions.
*   **For Recruiters (The Customer):** We provide a premium, AI-powered portal to discover, vet, and contact high-signal developer talent based on their real-world activity and demonstrated expertise.

### 1.3. The Vision
To become the definitive talent marketplace for the tech industry, built on a foundation of authentic, verifiable developer activity. We are not building a diary; we are building a career pipeline.

---
## 2. Target Audience

### 2.1. Primary Users: Developers
*   **Persona:** Active learners, from junior developers breaking into the industry to senior engineers keeping their skills sharp.
*   **Core Need:** A single place to track their learning, get help, build a reputation, and be discovered for their skills, not just their resume.

### 2.2. Primary Customers: Recruiters
*   **Persona:** Tech recruiters, hiring managers, and engineering leads at companies of all sizes.
*   **Core Need:** An efficient, high-signal tool to find qualified developers whose skills are verifiable through a track record of real-world work and community engagement.

---

## 3. Core Product Strategy: The "Two-Door" Model

Our platform is a two-sided marketplace with distinct experiences for each audience.

### 3.1. The Developer Workshop (`app.skilllog.com`)
*   **Goal:** Maximize developer engagement, content creation, and community value.
*   **Business Model:** **100% Free.** We win by building the best free tool for developers.
*   **Core Features:**
    *   Public & Private Logging
    *   Community Feed & Reputation System
    *   Real-time Study Circles
    *   AI-Powered Learning Assistant & Synthesis Report
### 3.2. The Recruiter Portal (`recruit.skilllog.com`)
*   **Goal:** Provide the most efficient and accurate tool for discovering tech talent.
*   **Business Model:** **Premium, Sales-Led Subscription.** Access is provisioned manually after verification.
*   **Core Features:**
    *   AI-Powered Talent Search
    *   Talent Spotlight Showcase
    *   Secure "Connect & Consent" Outreach System

---

## 4. Feature Breakdown

### 4.1. Developer Features (Free)
*   **Logging ("Proof-of-Work"):**
    *   Create logs with rich text, tags, and mood.
    *   **Crucially, add links to GitHub repositories and live demos.**
    *   Toggle visibility between `Public` (shared with the community) and `Private` (for personal use).
*   **Community Feed:**
    *   A global, real-time feed of all public logs.
    *   Sort by "Trending" (newest) and "Top" (most upvoted).
*   **Reputation Engine:**
    *   Upvote functionality on all public logs and comments.
    *   A visible `Reputation` score is attached to every user profile, calculated on the backend based on contributions.
*   **Study Circles:**
    *   Real-time chat rooms automatically created for popular tags.
    *   Users can join circles to ask questions, share resources, and collaborate.
*   **Living Profile (`/profile/[id]`):**
    *   A user's public, dynamic resume.
    *   Displays key stats: Reputation, Log Count, Streak.
    *   Features a "Skill Cloud" of their most-used tags.
    *   Tabbed interface to showcase their public logs and top comments.
*   **AI Tools:**
    *   **AI Skill Synthesis Report:** An on-demand, AI-generated summary of a user's skills, projects, and learning velocity, designed to be shared with recruiters.
    *   **AI Learning Assistant:** A floating chatbot for on-demand help with coding questions and learning concepts.
*   **Settings:**
    *   Update profile information (name, etc.).
    *   Toggle **"Open to Opportunities"** to become discoverable by recruiters.
    *   A private **Recruiter Inbox** to review and consent to outreach messages.

### 4.2. Recruiter Features (Paid)
*   **Dedicated Portal:** A separate, professional UI focused exclusively on talent discovery.
*   **AI-Powered Talent Search:**
    *   Semantic search for skills (e.g., "backend databases" finds users skilled in PostgreSQL).
    *   Filter candidates by minimum reputation score.
*   **Talent Spotlight:** A public, curated page showcasing top developers who are open to work, serving as a live demo of the platform's value.
*   **Secure Outreach:**
    *   A "Connect" button on developer profiles opens a modal to send a secure, on-platform message.
    *   The developer's email is never exposed until they choose to reply.

---

## 5. Design System: "Emerald"
## 5. Design System: "Emerald"

*   **Mood:** Professional, energetic, focused, modern, high-value.
*   **Color Palette:**
    *   **Background:** `#111827` (Deep Charcoal/Navy)
    *   **Surface:** `#1F2937` (Dark Gray/Blue)
    *   **Primary Accent:** `#34D399` (Vibrant Emerald Green)
    *   **Secondary Accent:** `#60A5FA` (Cool Blue)
    *   **Text (Primary):** `#F9FAFB` (Crisp Off-White)
    *   **Text (Secondary):** `#9CA3AF` (Muted Gray)
*   **Typography:** Inter font family, chosen for its excellent readability on screens.
*   **UI Principles:** High contrast for accessibility, clean and consistent spacing, subtle animations for feedback, and a professional, cohesive icon set.

---

## 6. Technical Architecture
*   **Frontend:**
    *   **Framework:** React 18+
    *   **Language:** TypeScript
    *   **Styling:** TailwindCSS (utility-first)
    *   **Module System:** ESM

*   **Backend (Supabase Platform):**
    *   **Database:** Supabase PostgreSQL is the single source of truth for all application data.
    *   **Authentication:** Supabase Auth handles all user authentication (sign-up, sign-in, session management). It is the secure "front door" for both developers and recruiters.
    *   **Storage:** Supabase Storage is used for hosting user-uploaded assets like log screenshots.
    *   **Real-time:** Supabase Realtime is leveraged for the live chat functionality within "Study Circles."

*   **Server-side Logic (The Secure API Layer):**
*   All business logic and third-party API interactions are encapsulated in **Supabase Edge Functions** (Deno runtime). This ensures security and scalability.
    *   **Core Functions:**
        *   `update-profile`: Securely updates user profile data.
        *   `upvote-item`: Atomically handles reputation and upvote increments.
        *   `send-outreach-message`: Persists recruiter messages to the database.
        *   `search-developers`: Powers the AI-enhanced talent search for recruiters.
        *   `generate-synthesis-report`: Handles secure calls to the Gemini API for report generation.
        *   `get-chatbot-response`: Manages the conversational AI logic for the learning assistant.

*   **AI Integration:**
    *   **Provider:** Google Gemini API (specifically `gemini-2.5-flash`).
    *   **Security:** The Gemini API key is stored **exclusively** as a secret in the Supabase backend (`Deno.env.get('GEMINI_API_KEY')`). It is never exposed to the client-side application. All AI-related calls are proxied through secure Edge Functions.

*   **Security Model:**
    *   **Role-Based Access Control (RBAC):** The `profiles` table contains a `role` column (`developer` or `recruiter`). The application renders a completely different UI based on this role, creating a two-sided platform.
    *   **Row Level Security (RLS):** RLS policies are enabled on all database tables. These policies are the ultimate source of truth for data access, ensuring users can only read or write data they are explicitly permitted to (e.g., a user can only update their own profile; a developer can only see outreach messages sent to them).
    *   **API Layer:** The frontend does not interact with the database directly for mutations. All writes and sensitive reads go through the secure, authenticated Edge Function API layer, which respects RLS policies.

---

## 7. Go-to-Market & Growth Strategy
### 7.1. Phase 1: Seeding the Community (Developer Acquisition)
*   **Core Tactic:** Content-driven growth. We will target developer communities (Reddit, Hacker News, Dev.to, Twitter) by sharing high-value content generated *from* our platform.
*   **Example:** A blog post titled "We Analyzed 10,000 Learning Logs: Here's What Developers are Studying in 2024" that links back to our public feed.
*   **Viral Loop:** The "AI Skill Synthesis Report" is inherently shareable. When a developer shares their report on LinkedIn to get a job, it acts as a powerful advertisement for our platform.

### 7.2. Phase 2: Validating the B2B Model (Recruiter Acquisition)
*   **Core Tactic:** Direct, sales-led outreach. We will not wait for recruiters to find us.
*   **The Funnel:**
    1.  The `/recruiters` landing page acts as our primary sales tool.
    2.  The "Talent Spotlight" page serves as our live demo, proving the quality of our talent pool.
    3.  The "Request Early Access" button (`mailto:`) is our lead capture mechanism.
*   **Initial Target:** We will manually reach out to a small, curated list of 10-20 tech recruiters and hiring managers, offering them free, white-glove access to our search tools in exchange for feedback. This validates our B2B value proposition before we build a billing system.

### 7.3. Phase 3: Scaling the Marketplace
*   Once we have a critical mass of active developers and a waitlist of paying recruiters, we will build out the full, self-serve Recruiter Portal with subscription management and billing.
*   The developer community's growth fuels the value of the recruiter product, and the revenue from the recruiter product funds the development of better free tools for the developer community. This is our sustainable, long-term growth engine.
