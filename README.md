# 🤖 AI-Powered Apps — Two Projects, One Repo

> *A full-stack AI learning project exploring two real-world use cases: a conversational assistant and an intelligent review summarizer — built while mastering the OpenAI API.*


## The Story

This monorepo is home to **two distinct AI-powered projects**, each tackling a different problem with a different approach:

### 🎢 Project 1 — WonderWorld Park Assistant
Every great theme park needs a great guide. Ask anything about WonderWorld — hours, rides, tickets, tips. The bot remembers your conversation, picks up where you left off, and stays in character as a park support agent.

### ⭐ Project 2 — AI Product Review Summarizer
Hundreds of reviews, distilled into one paragraph. Hit a button, get a summary. Generated on demand by GPT-4.1, then cached for a week so repeat visitors get instant results with zero extra API calls.


Along the way, this repo covers multi-turn conversation state, LLM caching strategies, REST API design, and a polished React frontend — all wired together in a clean monorepo.


## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Multi-turn Chatbot** | Maintains conversation context across messages using OpenAI's `previous_response_id` chaining |
| 🎡 **Park-Aware AI** | System prompt injected with WonderWorld park info — the bot *knows* the park |
| ⭐ **Review Summarizer** | Condenses up to 10 reviews into a readable paragraph using GPT-4.1 |
| ⚡ **Smart Caching** | Summaries cached in MySQL with a 7-day TTL — no redundant LLM calls |
| 💬 **Rich Chat UI** | Typing indicators, markdown rendering, auto-scroll, and Enter-to-send |
| 📦 **Monorepo Structure** | Clean separation of server and client with shared conventions |


## 🏗️ Architecture

```
chat-bot/
├── packages/
│   ├── server/          # Express + Prisma + OpenAI
│   │   ├── models/
│   │   │   ├── chat.ts       # GPT-4o-mini, conversation state
│   │   │   └── summary.ts    # GPT-4.1, DB-cached review summaries
│   │   └── routes/           # REST API endpoints
│   │
│   └── client/          # React + Vite + TanStack Query
│       ├── pages/
│       │   ├── Home.tsx      # Chatbot UI
│       │   ├── IndexPage.tsx # Product listing
│       │   └── ShowPage.tsx  # Product detail + "Get Summary"
│       └── components/       # Shared UI components
```


## 🧠 How the AI Works

### The Chatbot

The park assistant runs on **GPT-4o-mini** via the OpenAI Responses API. Each conversation is identified by a `conversationId`, and the server tracks the last `responseId` in an in-memory map:

```
User message → lookup conversationId → pass previous_response_id → OpenAI → store new responseId
```

The model's system prompt is pre-loaded with everything it needs to know about WonderWorld — making it a grounded, in-character assistant rather than a generic chatbot.

> **Note:** Conversation state is held in memory and resets on server restart. A persistent DB-backed implementation is a natural next step.


### The Review Summarizer

Product reviews are summarized on demand and cached aggressively:

```
GET /api/products/:id/reviews/summarize
    → cache hit?  → return cached summary
    → cache miss? → POST /summarize → GPT-4.1 → store in MySQL with 7-day TTL
```

This pattern — **generate once, serve many times** — is a core LLM cost optimization strategy demonstrated hands-on.


## 🛠️ Tech Stack

**Backend**

- [Express](https://expressjs.com/) — HTTP server & routing
- [Prisma](https://www.prisma.io/) — ORM with MySQL
- [OpenAI Node SDK](https://github.com/openai/openai-node) — `client.responses.create`

**Frontend**

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — UI framework & build tool
- [TanStack Query](https://tanstack.com/query) — Data fetching & caching
- [React Hook Form](https://react-hook-form.com/) — Form state management
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — Styling
- [react-markdown](https://github.com/remarkjs/react-markdown) — Render AI responses beautifully

**Database**
- MySQL via Prisma — `Product`, `Review`, `Summary` models


## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- OpenAI API key

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/chat-bot.git
cd chat-bot

# Install dependencies
npm install

# Set up environment variables
cp packages/server/.env.example packages/server/.env
# Add your OPENAI_API_KEY and DATABASE_URL

# Run Prisma migrations
cd packages/server
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### Running the App

```bash
# Start the backend (from packages/server)
npm run dev

# Start the frontend (from packages/client)
npm run dev
```

The client will be available at `http://localhost:5173` and the API at `http://localhost:3000`.


## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message to the park assistant |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Product detail with reviews & cached summary |
| `GET` | `/api/products/:id/reviews` | Product reviews |
| `GET` | `/api/products/:id/reviews/summarize` | Return cached summary |
| `POST` | `/api/products/:id/reviews/summarize` | Generate & cache summary |

### Chat Request

```json
POST /api/chat
{
  "conversationId": "uuid-here",
  "message": "What time does the park open?"
}
```

```json
// Response
{
  "reply": "WonderWorld opens at 9:00 AM daily! On weekends and holidays, gates open at 8:30 AM for annual passholders. Is there anything else you'd like to know? 🎢"
}
```


## 🗃️ Database Schema

```prisma
model Product {
  id       Int      @id @default(autoincrement())
  name     String
  reviews  Review[]
  summary  Summary?
}

model Review {
  id        Int     @id @default(autoincrement())
  body      String
  rating    Int
  productId Int
  product   Product @relation(fields: [productId], references: [id])
}

model Summary {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  expiresAt DateTime
  productId Int      @unique
  product   Product  @relation(fields: [productId], references: [id])
}
```


## 📚 Course Context

This project was built as part of an **AI-Powered Apps** course. Each section added a new capability:

- **Section 1** — REST API scaffolding with Express + Prisma
- **Section 2** — Product listing & review endpoints
- **Section 3** — Review summarizer with GPT-4.1 + DB caching
- **Section 4** — Multi-turn chatbot with OpenAI Responses API
- **Section 5** — React frontend with TanStack Query + chat UI




---

<p align="center">Built with ☕ and curiosity</p>
