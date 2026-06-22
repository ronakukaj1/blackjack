# Blackjack

A full-stack blackjack game with a React frontend and an Express backend. The backend integrates with the [Deck of Cards API](https://deckofcardsapi.com/) - the frontend never calls it directly.

## Project structure

```
backend/     Express API (port 3001)
frontend/    React + Vite (port 3000)
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+

## Run locally

Install dependencies once in each app:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Start both servers in separate terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The frontend talks to the backend at `http://localhost:3001`. If the backend is not running, you'll see an error banner in the UI.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/games` | Start a new game (deal 4 cards) |
| `POST` | `/api/games/:id/hit` | Draw one card for the player |
| `POST` | `/api/games/:id/stand` | Player stands; dealer plays out |

## How to play

1. Click **New Game** to deal.
2. **Hit** to draw another card, or **Stand** to hold your hand.
3. If you go over 21, you bust and lose.
4. When you stand, the dealer draws until reaching 17 or higher.
5. Closest to 21 without busting wins. Blackjack (21 on two cards) beats a regular 21.

## Tech stack

- **Backend:** Express, in-memory game store, Deck of Cards API
- **Frontend:** React + Vite

## Design docs

- [Whiteboard sketch](docs/BlackJack.png)
- [Postman collection](docs/backjack-postman.json)

