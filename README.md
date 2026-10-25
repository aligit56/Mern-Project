# Item Inventory CRUD App

A full-stack item inventory app with a React/Vite frontend and a Cloudflare Pages Functions API backed by D1 (SQLite). It supports creating, listing, editing, and deleting items without reloading the page.

This deployment uses Cloudflare D1 for persistent hosted storage and does not require a local MongoDB server. The backend is Cloudflare Pages Functions, not Express/MongoDB.

## Requirements

- Node.js 20 or newer
- npm
- A free Cloudflare account

## Run locally with Cloudflare Pages

From the project root:

npm install

Create a local D1 database and apply its schema:

```sh
npm run db:local
```

Build the frontend and start the local Pages server (serves both UI and API):

```powershell
npm run build
npm run dev
```

Open the local URL printed by Wrangler, usually `http://localhost:8788`.

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

## Deploy to Cloudflare Pages

1. Push this repository to GitHub and sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. From the project root, log Wrangler into your Cloudflare account and create the D1 database. Wrangler writes its ID into `wrangler.jsonc`:

   ```sh
   npx wrangler login
   npx wrangler d1 create mern-project-db --binding DB --update-config
   ```

   If you already created the database in the dashboard, copy its ID into `wrangler.jsonc`, replacing the all-zero `database_id` placeholder.

3. Apply the schema migration to the remote D1 database:

   ```sh
   npm run db:remote
   ```

4. Commit and push the updated D1 ID in `wrangler.jsonc` so the Pages build can bind to the database:

   ```sh
   git add wrangler.jsonc
   git commit -m "Configure Cloudflare D1"
   git push
   ```

5. Create a Cloudflare Pages project and connect the GitHub repository. Use the `main` branch.
6. Set the build command to `npm run build` and the build output directory to `frontend/dist`. Keep the repository root as the project root so Cloudflare can discover `functions/` and `wrangler.jsonc`.
7. Confirm the Pages Functions D1 binding is named `DB` and uses the `mern-project-db` database. The binding is defined in `wrangler.jsonc`; redeploy after changing it.
8. When the deployment finishes, open the Pages URL and test item creation, editing, and deletion. The API health endpoint is `<your-pages-url>/api/health`.

The Cloudflare Workers Free plan currently includes limited Workers/Pages Functions usage and D1 includes free daily query limits. Review the current [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) for exact quotas.
