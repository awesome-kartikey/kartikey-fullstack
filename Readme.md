# 🚀 Fullstack Development Bootcamp

Welcome to the **Complete Fullstack Roadmap**! This repository is a comprehensive collection of learning materials, architectural patterns, and production-grade projects developed during the Fullstack Bootcamp. It spans the entire developer journey—from terminal workflows to scaling distributed systems.

---

## 🗺️ Roadmap & Modules

The repository is structured to follow a progressive learning path:

### 🛠️ Module 1: Development Ecosystem (`tools-course/`)
- CLI Mastery & Terminal Workflows
- Git & Version Control best practices
- Development environment optimization

### 🌐 Module 2: Web Fundamentals (`web/`)
A series of 11 sequential modules (00-10) covering:
- **00-05**: HTML5, CSS3, Flexbox/Grid, and Vanilla JavaScript.
- **06-09**: Intro to Server-Side development with Node.js and Express.
- **10-Capstone**: The **TeamHub Showcase** — involving both `teamhub-api` and `teamhub-next` projects.

### 🔷 Module 3: Modern Language Primitives (`typescript/`)
- Deep dive into Type Systems, Generics, and Decorators.
- **Projects**: `task-cli` (A Type-Safe command line interface).

### 🎨 Module 4: UI Design & Design Systems (`ui/`)
- Component-driven design principles.
- Responsive layout drills and advanced CSS-in-JS patterns.

### 💾 Module 5: Data Persistence & Architecture (`db/`)
- Relationship modeling (PostgreSQL).
- Docker-orchestrated database environments.
- Query optimization and SQL scripting.

### 🏗️ Module 6: Backend Infrastructure (`node/`)
- **Key Project**: `task-notes-api`
- Scalable Express patterns, Drizzle ORM, and Zod validation.
- Background job processing with **BullMQ** & **Redis**.
- Robust testing suites using **Vitest**.

### ⚛️ Module 7: Fullstack React (`next-js/`)
- React Server Components (RSC) and Server Actions.
- **Project**: `task-notes-frontend`
- Advanced patterns like dark mode theme flickering (FOUC) prevention.

---

## 🏆 Featured Projects

| Project | Stack | Repository Path |
| :--- | :--- | :--- |
| **TeamHub** | Next.js, Express, PostgreSQL | `web/10-capstone/` |
| **Task Notes API** | Node.js, Drizzle, BullMQ, Redis | `node/task-notes-api/` |
| **Task CLI** | TypeScript, Node.js | `typescript/task-cli/` |

---

## ⚙️ Tech Stack & Tooling

- **Languages**: TypeScript, JavaScript (Node.js)
- **Frontend**: Next.js (App Router), React, TailwindCSS, CSS Variables
- **Backend**: Express, BullMQ, Redis, Node.js
- **Persistence**: PostgreSQL, Drizzle ORM, Better-SQLite3
- **DevOps**: Docker, pnpm, Bun (for scripts)
- **Quality**: Vitest, Supertest, ESLint, Prettier

---

## 🚀 Getting Started

Ensure you have **Node.js 18+** and **pnpm** installed.

1.  **Environment Setup**:
    ```bash
    pnpm install
    ```
2.  **Infrastructure**:
    For database-heavy modules (Node/DB), ensure Docker is running:
    ```bash
    docker-compose up -d  # Where applicable
    ```
3.  **Run Development Servers**:
    Navigate to any project directory and run:
    ```bash
    npm run dev
    ```

---

## 💡 Knowledge Base

Check out [doubt.txt](doubt.txt) for deep-dive explanations on architectural decisions, such as:
- **FOUC Prevention** in React Themes.
- **SQL vs. NoSQL** selection criteria.
- **Prometheus** and Time-Series data strategies.

---

> _"Building the future, one commit at a time."_


