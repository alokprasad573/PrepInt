<div align="center">

# PrepInt - AI Powered Interview Preparation Platform

**Ace your next technical interview with AI-curated role-specific questions, instant concept breakdowns, and smart session tracking.**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_1.5-8E75C2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-Storage-FF9900?style=for-the-badge&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)
[![CI](https://github.com/alokprasad573/PrepInt/actions/workflows/ci.yml/badge.svg)](https://github.com/alokprasad573/PrepInt/actions/workflows/ci.yml)
[![CD](https://github.com/alokprasad573/PrepInt/actions/workflows/cd.yml/badge.svg)](https://github.com/alokprasad573/PrepInt/actions/workflows/cd.yml)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br />

<img src="https://prepint-s3-bucket.s3.ap-south-2.amazonaws.com/user_profile_images/1790505372255-wlyttrautli.png" alt="PrepInt Dashboard Preview" width="100%" style="border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);" />

</div>

---

## 📌 Executive Summary
**PrepInt** is an end-to-end full-stack web platform designed to streamline tech interview preparation. Leveraging **Google Gemini AI**, it delivers dynamic, personalized interview simulations based on target roles, experience levels, and focus topics with automated concept explanations and rich markdown visualization.

---

## 🌟 Key Features

- 🎯 **Targeted AI Question Generation** — Dynamically crafts interview questions customized by job designation, domain, years of experience, and niche focus topics.
- 💡 **Instant Deep-Dive Concept Explanations** — On-demand AI breakdowns of complex architectural and algorithmic concepts directly inside a responsive side-drawer.
- 📊 **Intelligent Session Command Center** — Seamlessly create, organize, review, expand, or delete preparation sessions with live metrics (total tracks, questions mastered).
- 🔍 **Real-Time Role & Topic Filtering** — Instant keyword search across preparation tracks to quickly locate specific tech stacks or questions.
- 📌 **Question Pinning & Notes** — Bookmark priority questions and attach personalized preparation notes to track revision progress.
- ⚡ **Zero-Latency UI & Motion** — Fluid micro-interactions, responsive side-drawers, skeletons, and loading indicators powered by Framer Motion.
- 📋 **Interactive Code Previews & Markdown Rendering** — Syntax-highlighted code blocks, copy-to-clipboard functionality, and structured markdown parsing.
- 🔐 **JWT-Based Authentication & Cloud Storage** — Secure user sign-up/login sessions with profile photo storage powered by **AWS S3**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    classDef client fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef server fill:#059669,stroke:#047857,stroke-width:2px,color:#fff;
    classDef cloud fill:#d97706,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef db fill:#7c3aed,stroke:#6d28d9,stroke-width:2px,color:#fff;

    subgraph ClientLayer["🖥️ Frontend Client (React 18 + Vite)"]
        UI["React SPA UI Components"]:::client
        Framer["Framer Motion (Transitions & Gestures)"]:::client
        Axios["Axios Interceptor (Bearer Token Auth)"]:::client
        Context["User Context & State Management"]:::client
    end

    subgraph ServerLayer["⚙️ Backend API (Node.js + Express)"]
        ExpressRouter["RESTful Express API Routes"]:::server
        AuthMiddleware["JWT Authentication Middleware"]:::server
        UploadMiddleware["Multer / S3 Upload Middleware"]:::server
        Controllers["Controllers (Auth, Session, AI, Question)"]:::server
    end

    subgraph ExternalServices["☁️ Cloud Services & AI Engine"]
        GeminiAI["Google Gemini Generative AI SDK"]:::cloud
        AWSS3["AWS S3 Bucket (Object Storage)"]:::cloud
    end

    subgraph DatabaseLayer["🗄️ Database Tier (MongoDB Atlas)"]
        Mongoose["Mongoose ODM Models"]:::db
        MongoAtlas[("MongoDB Collections")]:::db
    end

    UI --> Framer
    UI --> Context
    UI --> Axios
    Axios -->|"HTTPS REST Requests"| ExpressRouter
    ExpressRouter --> AuthMiddleware
    ExpressRouter --> UploadMiddleware
    AuthMiddleware --> Controllers
    UploadMiddleware --> Controllers
    Controllers -->|"Prompt Execution & Q&A"| GeminiAI
    Controllers -->|"Profile Asset Uploads"| AWSS3
    Controllers -->|"CRUD Operations"| Mongoose
    Mongoose --> MongoAtlas
```

---

## 🗄️ Database Design (Schema ERD)

```mermaid
erDiagram
    USER ||--o{ SESSION : "creates & owns"
    SESSION ||--|{ QUESTION : "references & tracks"

    USER {
        ObjectId _id PK
        string name
        string email "Unique, Indexed"
        string password "Hashed (bcrypt)"
        string profileImageUrl "AWS S3 URL"
        date createdAt
        date updatedAt
    }

    SESSION {
        ObjectId _id PK
        ObjectId user FK "Refers to User"
        string role "Target Job Title"
        string experience "Years of Experience"
        string topicsToFocus "Comma-separated topics"
        string description "Session Context"
        ObjectId[] questions FK "Array of Question refs"
        date createdAt
        date updatedAt
    }

    QUESTION {
        ObjectId _id PK
        string question "AI Generated Question"
        string answer "AI Generated Solution"
        boolean isPinned "User Pin Status"
        string note "Custom User Notes"
        date createdAt
        date updatedAt
    }
```

---

## 💻 Tech Stack

### **Frontend**
| Technology | Purpose |
| :--- | :--- |
| **React 18** | Component-driven declarative UI architecture |
| **Vite** | Next-generation ultra-fast frontend build tooling |
| **Tailwind CSS** | Utility-first responsive styling and design system |
| **Framer Motion** | Physics-based animations and layout transitions |
| **Axios** | Promised-based HTTP client with centralized interceptors |
| **React Router DOM** | Client-side routing and protected routes |
| **markdown-to-jsx** | Real-time markdown and syntax rendering for AI solutions |
| **React Icons (Lu)** | Clean, lightweight icon suite |

### **Backend & Cloud**
| Technology | Purpose |
| :--- | :--- |
| **Node.js 18+** | High-performance asynchronous JavaScript runtime |
| **Express.js** | Scalable REST API architecture and routing |
| **MongoDB & Mongoose** | NoSQL document database with strict schema validation |
| **Google Gemini AI SDK** | Advanced LLM prompts for role-specific interview generation |
| **AWS S3** | Cloud object storage for user media and profile assets |
| **JWT & Bcrypt** | Secure stateless authentication and password hashing |
| **Multer** | Multipart form-data handling for file uploads |

---

## 📂 Project Structure

```
PrepInt/
├── .gitignore
├── README.md
├── client/                     # Frontend SPA (React 18 + Vite + Tailwind CSS)
│   ├── public/                 # Static public assets (icons, SVGs, favicon)
│   └── src/                    # Core frontend application source
│       ├── assets/             # Images, vector graphics, and brand assets
│       ├── components/         # Reusable UI component library
│       │   ├── cards/          # Profile display and interview session summary cards
│       │   ├── inputs/         # Styled inputs and interactive photo upload selector
│       │   ├── layouts/        # Application layout wrapper and top navigation bar
│       │   └── loader/         # Loading indicators (skeleton loaders & spinners)
│       ├── context/            # React Context providers (global user & session state)
│       ├── pages/              # Primary view pages and routing
│       │   ├── Auth/           # Authentication interfaces (Login and Registration)
│       │   ├── Home/           # User Dashboard and session creation modal forms
│       │   └── InterviewPrep/  # Core preparation hub (Question feed, AI drawer, code view)
│       └── utils/              # Axios instance, API endpoints, and utility functions
│
└── server/                     # Backend REST API (Node.js + Express + MongoDB)
    ├── config/                 # Database initialization and connection logic
    ├── controllers/            # Controller layer containing core business logic (AI, Auth, Session)
    ├── middlewares/            # Middleware pipeline (JWT authentication & file upload handlers)
    ├── models/                 # Mongoose database models & schema definitions
    ├── routes/                 # Express REST endpoint route definitions
    └── utils/                  # Gemini AI prompts and helper utilities
```

---

## 💼 Resume & Engineering Highlights

> **Core Competencies Demonstrated:** Full-Stack Architecture • Generative AI Orchestration • Cloud Infrastructure • Performance & State Optimization

### 🧠 Generative AI System Design
- **Deterministic Prompt Engineering:** Architected robust, schema-enforced prompt pipelines for **Google Gemini 1.5**, guaranteeing zero-parse-error JSON responses for dynamic question curation and technical breakdowns.
- **Fail-Safe Response Parsing:** Integrated multi-tier fallback parsing and sanitizer routines to defend against malformed LLM outputs and markdown code-block wrapping anomalies.

### ⚡ Frontend Performance & UX Engineering
- **Zero-Jank Side-Drawer Architecture:** Refactored the interactive concept explanation drawer to eliminate animation layout shifts, achieving instant, non-blocking rendering during intense study sessions.
- **Optimistic State & Asynchronous Feedback:** Engineered responsive user feedback patterns utilizing **Framer Motion**, skeleton placeholders, and synchronized loading spinners to mask network latencies.
- **Smart Markdown & Syntax Highlighting:** Integrated rich markdown rendering with automated copy-to-clipboard functionality and code-block syntax formatting for a developer-first interview preparation flow.

### 🛡️ Enterprise-Grade Security & Cloud Storage
- **Stateless Authentication:** Enforced JWT authentication with HTTP bearer tokens, bcrypt salt-hashing for passwords, and protected route middlewares across all private API surfaces.
- **Scalable Media Pipelines:** Integrated **AWS S3** via Multer memory buffering, offloading static file storage and enabling high-availability asset delivery.
- **Defensive API Architecture:** Standardized RESTful endpoints with centralized error handling, CORS security policies, and guarded database cascades on session deletion.

---

## 🔄 CI/CD

GitHub Actions is used for continuous integration, and Vercel handles deployment.

- **CI Pipeline (`.github/workflows/ci.yml`):** Triggers on pushes and PRs touching `client/**` or `server/**`, running frontend lint/build checks and backend syntax verification on Node 20.
- **Continuous Deployment (`.github/workflows/cd.yml`):** Deploys frontend and backend projects to **Vercel** for pull request previews and production rollouts on pushes to `main`.

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or later)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Google Gemini API Key**
- **AWS S3 Bucket & IAM Credentials** (for asset uploads)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/alokprasad573/AI-Powered-Interview-Preparation-Platform.git
cd AI-Powered-Interview-Preparation-Platform

# Setup Backend
cd server
npm install

# Setup Frontend
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
```

Create a `.env` file in the `client/` directory:
```env
VITE_BACKEND_URL=http://localhost:8000
```

### 4. Running the Application

```bash
# Terminal 1: Launch Backend
cd server
npm run dev

# Terminal 2: Launch Frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

<div align="center">
  <sub>Built with ❤️ by a passionate Software Engineer. Star ⭐ this repository if you find it helpful!</sub>
</div>

