# Express + Prisma ORM Fundamentals

Course project for **Express API & Prisma ORM Query Fundamentals** (Udemy).

A Dockerized Express.js REST API using Prisma ORM and PostgreSQL, covering schema design, migrations, CRUD operations, relational/hierarchical data, bulk inserts, filtering, joins, aggregation, and API documentation with Swagger.

---

## Tech Stack

- **Node.js** (v24, Alpine) + **Express.js**
- **Prisma ORM** (v7) with the `@prisma/adapter-pg` driver adapter
- **PostgreSQL 15**
- **Docker & Docker Compose**
- **Swagger** (`swagger-jsdoc`, `swagger-ui-express`, `swagger-autogen`) for auto-generated API docs
- **nodemon** for local dev auto-reload

---

## Project Structure

```
02-PRISMA-ORM/
├── docker-compose.yml
├── Dockerfile
├── init.sql                  # Schema-only Postgres bootstrap (pg_dump output)
├── db-data/                  # Bind-mounted Postgres data dir + seed CSVs
├── .vscode/settings.json
├── express-api/
│   ├── index.js
│   ├── package.json
│   ├── prisma.config.ts
│   ├── swagger.js            # swagger-autogen config
│   ├── swagger-output.json   # generated Swagger spec
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   └── resourses/            # seed data (CSVs) referenced by init.sql COPY statements
└── _commands.md               # reference: Prisma / Docker / Postgres commands
```

---

## Two Schema Workflows (why both exist)

This course deliberately teaches **two different approaches** to managing the database schema, at two different stages of learning:

| | **Migrations** (taught first) | **`init.sql` bootstrap** (used later) |
|---|---|---|
| Command | `npx prisma migrate dev` | Postgres auto-runs `init.sql` via `docker-entrypoint-initdb.d/` |
| Tracks history | Yes — versioned files in `prisma/migrations/` | No — one flat schema snapshot |
| Best for | Real projects, teams, persistent data | Fast resets while learning queries/filtering/joins |
| Reset cost | Can apply incrementally, no data loss | Requires wiping the Postgres volume to re-run |

**Why the switch:** once the course moves into querying — filtering, joins, aggregation, bulk inserts — constantly re-running migrations and reseeding by hand slows down experimentation. `init.sql` + a disposable Postgres volume gives a one-command reset (`down -v && up --build`) to a known-good dataset, which is better suited to rapid query practice than to schema evolution.

**In this project, migrations are currently unused** — schema creation and seed data (via CSV `COPY` statements) both happen through `init.sql`, and the Express container's startup command only runs `npx prisma generate` (no `migrate dev`/`deploy`).

> If you ever go back to the migrations-based workflow (e.g. for a real, persistent project), see `_commands.md` for the full Prisma migration command set.

---

## Getting Started

```bash
docker compose up -d --build
```

This will:
1. Build the `express-api` image from the `Dockerfile` (installing Express, Prisma + adapter, Swagger tooling, nodemon in separate cached layers)
2. Start Postgres, bootstrapped from `init.sql` (schema + seed data via `COPY`) — **only on a fresh, empty `db-data` volume**
3. Run `npx prisma generate` inside the API container to build the Prisma Client matching the schema
4. Start Prisma Studio in the background (`-b none`, no browser auto-launch)
5. Start the API with `nodemon` via `npm run dev`

### Ports
| Service | Container Port | Host Port |
|---|---|---|
| Express API | 3000 | `http://localhost:3000` |
| Prisma Studio | 5555 | `http://localhost:5556` |
| PostgreSQL | 5432 | `localhost:5433` |

### Environment
```yaml
DATABASE_URL: "postgresql://myuser:mypassword@postgres:5432/mydatabase?schema=public"
```

---

## Data Model

`Category` is a **self-referencing hierarchy** (parent/child categories), with a relation to `Product`.

Lessons learned building this:
- `parentId` is nullable — top-level categories have `parentId: null`.
- Avoid `ON DELETE CASCADE` on the self-referencing FK — it recursively deletes entire subtrees. Prefer `onDelete: Restrict` or `onDelete: SetNull`.
- `@@map("...")` sets the actual Postgres table name. A mismatch here (e.g. a typo) breaks any raw SQL that references the table directly — like `init.sql`'s `CREATE TABLE` / `COPY` statements.

---

## Bulk Inserts & Self-Referencing Data

`createMany()` is fast (single SQL statement) but:
- Doesn't return created rows (no generated `id`s back)
- Can't guarantee auto-increment IDs line up with parent/child references assumed in the same payload

For seeding a category tree in one request: insert **level by level** inside a `$transaction`, using `createManyAndReturn` to capture real IDs and map them to each row's positional/temp ID before inserting the next level.

If seed data (or `init.sql`) inserts explicit `id` values, resync the auto-increment sequence afterward so future app-driven inserts don't collide with seeded IDs:
```sql
SELECT setval(pg_get_serial_sequence('category', 'id'), max(id)) FROM category;
```

---

## Prisma 7 Driver Adapter

Prisma 7 removed the bundled query engine — `new PrismaClient()` with no arguments now throws. A driver adapter is required:

```js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

Enable query logging during development to see the exact SQL Prisma generates for any call:
```js
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  adapter,
});
```

---

## API Docs (Swagger)

`swagger.js` uses `swagger-autogen` to scan `./routes/*.js` and generate `swagger-output.json`, organized into sections matching the course's query topics:
- Data Relational Operations
- Query Examples
- Filtering Examples
- Join Queries
- Aggregation & Grouping

Regenerate the spec after adding/changing routes:
```bash
node swagger.js
```
Then serve it via `swagger-ui-express` (mounted in `index.js`) at whatever path you've configured (commonly `/api-docs`).

---

## Docker Notes

- **`node_modules` is a named volume**, separate from the bind-mounted source (`./express-api:/app`). It's only auto-seeded from the built image **the first time it's created**. If you add a package to the `Dockerfile` later, recreate the volume to pick it up:
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```
- **`init.sql` only runs on a genuinely empty `db-data` directory.** If Postgres already has data on disk, it logs `Skipping initialization` and silently ignores `init.sql` — including any fixes you've made to it. Wipe and rebuild to reapply:
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```
- Since `db-data` is a **bind mount** (`./db-data:/data`) rather than a named volume, deleting it directly also works:
  ```bash
  rm -rf ./db-data
  docker compose up -d --build
  ```

---

## Command Reference

See [`_commands.md`](./_commands.md) for the full list. Highlights:

```bash
# Rebuild everything from scratch
docker compose down -v
docker compose up -d --build

# Shell into a container
docker exec -it express_api /bin/sh
docker exec -it postgres_db /bin/bash

# Inspect the database
\dt                  # list tables
\d category           # describe a table

# Dump schema only (used to regenerate init.sql)
pg_dump -h localhost -p 5433 -U myuser -d mydatabase --schema-only --no-owner --no-acl --no-comments > init.sql
```

---

# Docker Hub -> Docker Disktop[Image] -> Container[ Postgres[Port(5432)] ] 

# 1. Docker
 - Docker is an open Sourse Platform design for developing, shipping and running applications inside cointainers.

 # 1.1 Docker Images
   - A Docker Image is a read-only, lightweight, standalone template that contains everything needed to run an application. Think of it as a blueprint, a snapshot, or a master copy of your software package.An image includes your application code, runtime environments (like Node.js), system tools, core libraries, and default configurations.To understand it clearly, it helps to use analogies that relate directly to the software development concepts you already know.
 # 1.1.1 The Best Analogies
   - The Class vs. Object Analogy (OOP):If you are familiar with Object-Oriented Programming, a Docker Image is the Class. It is the blueprint that defines the structure. A Docker Container is the actual instantiated Object running live in system memory. You can use one single class (Image) to instantiate ten different running objects (Containers) simultaneously.
 # 1.2 Docker Containers
   - Easier for us to create the application, manage that application and of course then share that application.
 # 1.2.1 Docker Compose
   - is a tool to help us manage multi-container setup in Docker.
 # 1.3 Volumes
 
 # 2. Prismia ORM
   - ORM stands for Object-Relational Mapping.
   - In the context of Prisma, it acts as a highly advanced translator bridge 
   between your object-oriented application code (TypeScript/JavaScript) and your relational storage tables (PostgreSQL).
   - By Default Prisma Models fields are Required.   

   ## License
   Personal learning project — not for production use.
