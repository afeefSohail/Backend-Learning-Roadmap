📁 02-PRISMA-ORM/
│
├── 📁 01-Environment-Setup
│   ├── 📄 01-docker-compose.yml     # Orchestrating the Postgres and Node app services
│   ├── 📄 02-env-configuration.txt  # Mapping out the DATABASE_URL connection keys
│   └── 📄 03-tsconfig-rules.json   # Tracking strict compiler bindings for Prisma types
│
├── 📁 02-Schema-Migrations
│   ├── 📁 prisma/
│   │   └── 📄 schema.prisma         # The database structural configuration engine
│   └── 📄 01-migration-commands.txt # Logging 'prisma migrate dev' state changes
│
├── 📁 03-Express-Core-CRUD
│   ├── 📁 src/
│   │   ├── 📄 client.ts             # Instantiating the Singleton PrismaClient handler
│   │   ├── 📄 server.ts             # Express server and router mapping entrypoint
│   │   └── 📁 controllers/
│   │       ├── 📄 create-record.ts  # Executing basic .create() operations
│   │       ├── 📄 read-records.ts   # Executing .findMany() and .findUnique() operations
│   │       ├── 📄 update-record.ts  # Executing .update() operations
│   │       └── 📄 delete-record.ts  # Executing .delete() operations
│   └── 📄 package.json
│
├── 📁 04-Advanced-Queries
│   └── 📁 src/controllers/
│       ├── 📄 data-relations.ts     # Fetching nested items via 'include' or 'select'
│       ├── 📄 data-filtering.ts     # Applying search lookups (contains, in, AND, OR)
│       ├── 📄 page-offset.ts        # Traditional pagination using 'skip' and 'take'
│       ├── 📄 page-cursor.ts        # High-traffic cursor pagination using 'cursor'
│       ├── 📄 aggregations.ts       # Performing database summaries (_count, _sum, _avg)
│       └── 📄 transactions.ts       # Handling sequential arrays via '$transaction([])'

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
   - 
