# <img src="apps/web/public/logo.png" alt="FlowDraw Logo" width="28" style="vertical-align: middle;"/> FlowDraw

**FlowDraw** is a collaborative drawing and whiteboard platform built for real-time creativity and low-latency collaboration. Create canvases, invite teammates, and draw together — or open a private, solo document for personal sketches. Focused on performance, security, and a clean UX, FlowDraw ships with persistent storage for shapes and an ephemeral real-time layer for smooth interactions.

---

## 🚀 Quick summary

- **Real-time collaborative whiteboard** with live cursors and instant sync.
- **Solo mode** for private documents.
- **Persistent shape storage** in PostgreSQL (Prisma) + ephemeral real-time synchronization via WebSocket server.
- **Secure sign-in** using Google OAuth + JWT via NextAuth.js.

---

## ✨ Features

- 🎨 **Drawing Tools**: Rectangle, Circle, Line, Rhombus, Arrows, Pencil, Freehand. Built for fast creation and manipulation.
- ⚪ **Custom colors**: Choose your favorite color and start creating with severals storke width.
- 📸: **Image**: Supports image upload with drag and drop feature along with other drawing tools.
- 👥 **Collaboration**: Real-time canvas sync across multiple users - edits, shape updates, and presence events are immediately propagated.
- ✏️ **Solo Mode**: Create non-collaborative documents for private work.
- 🖱️ **Live Cursors & Presence**: See who’s online and where they’re drawing in realtime.
- 🔐 **Authentication**: Google OAuth with JWT via NextAuth.js for secure sign-in.
- 📜 **Authorization**: Access to documents limited to the document owner and explicit members; roles and permissions enforced server-side.
- 🧠 **Undo / Redo**: Full undo/redo support in both solo and collaborative sessions (operation-aware stacking).
- 🌎 **Zoom, Pan & Reset**: Smooth navigation for large canvases; reset view to default with one click.
- 🧾 **Persistent Shape Storage**: All shapes saved to PostgreSQL via Prisma so collaborators can resume work later.
- 🔑 **Rejoin with Code**: Re-enter a document or room using a shareable code.
- 👋 **Join / Leave Notifications**: Presence notifications when users join or leave a document.
- ♾️ **Unlimited Strokes**: No artificial caps on shapes.

---

## 🛠️ Tech Stack

| Category         | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | Next.js (React) + TypeScript     |
| Styling          | Tailwind CSS                     |
| Auth             | NextAuth.js (Google OAuth) + JWT |
| Realtime         | WebSocket (Socket.IO)            |
| Backend          | Express                          |
| Database         | PostgreSQL                       |
| ORM              | Prisma                           |
| State Management | Zustand(shared store)            |

---

## 🔧 Getting started (development)

> These instructions assume a monorepo layout and `pnpm` usage (you can adapt to `npm`/`yarn`).

1. Clone the repo

```bash
git clone https://github.com/your-username/flowdraw.git
cd flowdraw
```

2. Install dependencies

```bash
pnpm install
```

3. Create environment files

Create `.env` in the frontend (or repo root depending on your setup). Example variables:

```env
# NextAuth / Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Public urls
NEXT_PUBLIC_SOCKET_URL=https://flowdraw-ws.onrender.com
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/flowdraw
```

4. Prepare the database (Prisma)

```bash
# generate client
pnpm --filter packages/db prisma generate

# run migrations
pnpm --filter packages/db prisma migrate dev --name init
```

5. Start the WebSocket server (realtime layer)

Open a terminal for the WebSocket server (see `/packages/ws`) and run the dev command used in your repo (for example):

```bash
cd apps/ws-server
pnpm dev
```

6. Start the frontend

```bash
pnpm --filter apps/web dev
```

7. Open your browser at `http://localhost:3000`

---

## 🧩 Architecture overview

1. **Frontend (Next.js)** handles UI, authentication, and user interactions. It keeps a local operational log + optimistic updates for a snappy UX.
2. **WebSocket Server** receives events (create shape, update, delete, presence, undo/redo operations) and relays them to other clients in the room.
3. **Database (Postgres + Prisma)** is used to persist shapes and document metadata. The server writes snapshots or discrete shape records so documents are restorable.

---

## 🔐 Security & Auth

- Google OAuth is handled via NextAuth. Sessions are JWT-backed with a `NEXTAUTH_SECRET`.
- Authorization checks are enforced on the server for document access (owner/members-only). The WebSocket server validates JWTs before allowing socket connections.

---

## 🤝 Contributing

Contributions are very welcome — please follow this flow:

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: \`git commit -m "feat: add x"
4. Push and open a PR

Please include screenshots or a short demo when submitting UI changes.

---

## 📜 License

FlowDraw is open-source and released under the **MIT License**. See `LICENSE` for details.

---

## ✉️ Contact

If you need help with deployment or have security questions, open an issue.
