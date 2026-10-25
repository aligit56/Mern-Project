# Mern Project

A full-stack item inventory app with a React/Vite frontend and an Express API. It supports creating, listing, editing, and deleting items without reloading the page.

> This version stores items in `backend/data/items.json` and does not require MongoDB. It is suitable for local development and demos. For deployment, use a host with a persistent disk and set `ITEMS_FILE_PATH` to a file on that disk; ephemeral hosting can reset JSON data when the app restarts.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

Open two terminals from the project directory.

Terminal 1 — backend:

```powershell
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

Terminal 2 — frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/items` | List items |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items` | Create an item |
| `PUT` | `/api/items/:id` | Update an item |
| `DELETE` | `/api/items/:id` | Delete an item |
| `GET` | `/api/health` | API health status |

Items have a required `title` and non-negative `price`, plus optional `description` and `category`.

## Configuration

The API uses port `5000` by default. Set `PORT` to change it. The frontend uses `http://localhost:5000/api/items` by default; set `VITE_API_URL` in `frontend/.env` if the API is hosted elsewhere.

For persistent JSON storage on a host that provides a mounted disk, set `ITEMS_FILE_PATH` to a path on that disk, such as `/var/data/items.json`.
