# User Auth

### Step 1: Run The Project
`docker compose up -d --build`

### Step 2: Generate Initial Schema Migaration 
`docker compose exec user-auth npx prisma migrate dev --name init`

### Step 2.1: Push Your Schema to the Database active PostgreSQL container
`docker exec -it user_auth_api npx prisma db push`

### Step 2: Generate JWT_ACCESS_SECRET , JWT_REFRESH_SECRET
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`