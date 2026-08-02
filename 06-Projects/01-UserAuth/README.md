src/
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── photo.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── photo.controller.ts
├── middleware/
│   ├── auth.middleware.ts      # verifies JWT, attaches req.user
│   └── upload.middleware.ts    # Multer config
├── validators/
│   ├── auth.validators.ts      # Zod schemas
│   └── user.validators.ts
├── app.ts
└── main.ts