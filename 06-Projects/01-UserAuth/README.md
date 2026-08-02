# User Auth + Photos API

A TypeScript + Express + Prisma + PostgreSQL backend implementing email/password authentication with access/refresh JWTs, user profile management, and photo uploads — built as a capstone project applying everything from the Backend Learning Roadmap (JavaScript → TypeScript → Node → Express → PostgreSQL → Prisma → Docker), plus three new tools learned in the process: **bcrypt**, **Zod**, and **Multer**.

---

## Tech Stack

- **Node.js** (Alpine) + **Express 5** + **TypeScript** (ESM — `"type": "module"`)
- **tsx** for dev (compiles + runs `.ts` directly, replaces `nodemon`)
- **Prisma ORM (v7)** with `@prisma/adapter-pg` driver adapter
- **PostgreSQL 15**
- **bcryptjs** — password hashing
- **jsonwebtoken** — access + refresh token issuance/verification
- **Zod** — request validation
- **Multer** — multipart photo uploads
- **swagger-autogen** + **swagger-ui-express** — API documentation
- **Docker & Docker Compose**

---

## Project Structure

```
01-UserAuth/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── prisma.config.ts
├── swagger.js
├── uploads/                    # Multer-written photo files (gitignored)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── main.ts                 # entry point — starts the server
    ├── app.ts                  # Express app config — middleware, routes, Swagger mount
    ├── routes/
    │   ├── auth.route.ts
    │   ├── user.route.ts
    │   └── photo.route.ts
    ├── controllers/
    │   ├── auth.controllers.ts
    │   ├── user.controllers.ts
    │   └── photo.controllers.ts
    ├── middleware/
    │   ├── auth.middleware.ts       # requireAuth — verifies access token
    │   ├── upload.middleware.ts     # Multer config
    │   └── validate.middleware.ts   # Zod validation middleware
    ├── validators/
    │   └── auth.validator.ts
    └── utils/
        ├── jwt.util.ts              # centralized sign/verify logic
        ├── url.util.ts              # withFullPhotoUrl helper
        └── path.ts                  # getPaths(import.meta.url) — ESM __dirname equivalent
```

---

## Data Model

```prisma
model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  passwordHash  String
  name          String?
  photos        Photo[]
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())

  @@map("user")
}

model Photo {
  id        Int      @id @default(autoincrement())
  url       String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  createdAt DateTime @default(now())

  @@map("photo")
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@map("refresh_token")
}
```

`onDelete: Cascade` here is intentional and correct — unlike a self-referencing category tree, deleting a user *should* delete their photos and sessions. Deleting a `User` also requires manually cleaning up the actual files on disk (`fs.unlink`), since cascade only removes database rows, not files.

---

## Auth Flow: Access + Refresh Tokens

Chose the **stateful refresh / stateless access** pattern deliberately, over a simpler single-token or "re-login every app launch" model, specifically to learn the reasoning behind it (see rationale below).

| Token | Lifetime | Stored in DB? | Purpose |
|---|---|---|---|
| Access token | 15 min | No | Sent with every request; verified by signature only |
| Refresh token | 7 days | Yes | Exchanged for a new access token; the *only* thing that's actually revocable |

**Why store the refresh token and not the access token:** `jwt.verify()` alone can only confirm a token is authentic and unexpired — it can't be told "cancel this one early." Storing the refresh token in the DB is what makes logout mean something: deleting the row makes that token permanently unusable, regardless of its remaining lifespan, while the access token stays fast to verify (no DB hit) at the cost of a bounded, short-lived revocation delay.

**Routes:**
```
POST /auth/register   — bcrypt.hash password, create user
POST /auth/login      — bcrypt.compare, issue both tokens, persist refresh token
POST /auth/refresh    — validate stored refresh token, issue new access token
POST /auth/logout     — delete the refresh token row (no access token required —
                         logging out must work even with an expired access token)
GET  /auth/me         — requireAuth, return current user
```

**Client refresh strategy:** reactive — call `/auth/refresh` only after a request fails with `401`, then retry the original request. Simpler and more robust than proactively refreshing on a timer.

---

## Security Decisions Worth Remembering

- **`bcrypt.hash()` vs `bcrypt.compare()`** — hash only at registration (creates a new hash); compare only at login (checks against the stored hash). Mixing these up silently breaks login.
- **Vague auth errors** — `"Invalid email or password"` used for both "no such user" and "wrong password," to prevent email enumeration.
- **`/user/me` never trusts a client-supplied ID** — edit/delete/list-own-photos routes always scope by `req.userId` (from the verified JWT), never from params or body. `/user/:id` (public profile) is the only place a client-supplied ID is trusted, and only for read access.
- **Ownership checks before mutation** — `deletePhoto` combines the ownership check directly into the `delete` call (`where: { id, AND: { userId } }`), making it a single atomic, race-condition-free operation rather than "check, then act" as two separate queries.
- **Credentials never go in query strings** — always `req.body`, since URLs end up in logs/browser history.
- **`Authorization: Bearer <token>`** — not a JWT-specific convention, it's the HTTP standard (RFC 6750) for distinguishing token schemes; also what Swagger UI and most HTTP client libraries assume by default.

---

## Validation (Zod)

Schemas wrapped as `{ body: z.object({...}) }`, paired with a reusable middleware:
```typescript
export const validate = (schema: ZodType) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body });
  if (!result.success) return res.status(400).json({ success: false, errors: ... });
  next();
};
```
`.trim()` and `.toLowerCase()` on email fields prevent whitespace/casing from creating duplicate "different" users with the same real address. `z.infer<typeof schema>["body"]` derives the matching TypeScript type directly from the schema — one source of truth for runtime validation and compile-time types, no manually maintained duplicate interface.

---

## File Uploads (Multer)

- `diskStorage` with a generated filename (`timestamp-random.ext`) — prevents collisions between users uploading same-named files.
- `fileFilter` restricts to image MIME types only.
- **Store the relative path in the DB (`/uploads/filename.jpg`), never the full URL.** Compute the full URL (`API_BASE_URL` + relative path) at *read* time, not write time — otherwise every already-uploaded photo's URL breaks the moment `API_BASE_URL` changes (deploying, switching from Simulator to a physical device on the LAN, moving to a CDN, etc.).
- `express.static("/uploads", ...)` serves files directly — no separate download route needed.

---

## TypeScript Notes

- **`Request<Params, ResBody, ReqBody>` generics are required when the handler is defined separately from the route** — Express's type inference only narrows `req.params`/`req.body` automatically when it can see the route path at the same point the handler is declared. Since this project separates routes from controllers (MVC-style), every controller needs explicit generics, e.g. `Request<{ id: string }>` or `Request<{}, {}, LoginInput>`.
- **ESM (`"type": "module"`) means no `__dirname`/`__filename`.** `process.cwd()` still works (process-level, not module-system-dependent) and was used everywhere path resolution was needed in this project. A `getPaths(import.meta.url)` utility exists for the rarer case of needing a path *relative to a specific file's location* rather than the process's working directory.
- **`moduleResolution` must pair correctly with `module`** — `commonjs` pairs with `node`; `nodenext`/`esnext` pairs with `bundler`/`nodenext`. Mismatches produce confusing, seemingly unrelated errors (subpath imports failing to resolve, `.json` imports requiring special syntax).

---

## Docker: The Host/Container Split

Bind-mounting the project (`.:/app`) while using a **named volume** for `node_modules` means the container and host have two independent installations. Practical consequence: any `npm install` or `prisma generate` run only *inside* the container is invisible to the local editor's TypeScript server, and vice versa — both must be run for changes to be reflected everywhere (`docker compose exec user-auth npm install ...` *and* `npm install` locally).

Dockerfile `RUN npm install` layers only affect the *image* — once the bind mount is active, they're overridden entirely, so `package.json` must be reconciled manually (or reinstalled via `docker compose exec`) rather than assumed correct from the Dockerfile alone.

---

## Swagger Gotchas

- `swagger-autogen` infers route prefixes (`app.use("/auth", authRouter)`) only when it can trace through your **entry file** — but this tracing is unreliable against TypeScript/ESM. The reliable fix: point `endpointsFiles` at the route files directly, and explicitly declare the full path per route with `#swagger.path = '/auth/register'`.
- Comments must live in the **route file**, next to the `router.get/post(...)` call — not inside the imported controller function — since swagger-autogen does static text scanning, not import tracing.
- OpenAPI path params use `{id}` (curly braces); Express route params use `:id` (colon) — two different, non-interchangeable conventions.

---

## What Was Learned Here, Beyond bcrypt/Zod/Multer

- Why revocability requires server-side state, even with an otherwise-stateless auth mechanism
- TypeScript's generic `Request` typing and when it's actually necessary
- ESM vs CommonJS tradeoffs, encountered through real friction rather than abstract explanation
- The Docker bind-mount + named-volume host/container split, and why it causes "works in container, broken in editor" bugs
- Atomic ownership-scoped mutations (`where: { id, AND: { userId } }`) over separate check-then-act queries

---

## License

Personal learning project — not for production use.