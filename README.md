# ---------------- Node.js -------------------
# https://nodejs.org/docs/latest/api/
# 1. Build-in Modules (OS , PATH, FS, HTTP) 
# 2. Using CommonJS (require / module.exports)
#  -- Loads modules synchronously
#  -- Runs in Node.js only       
#  -- const x = require("./file");
#  -- CommonJS (dynamic) you can require anywhere in code
#  -- Module is executed when required
#  -- Performace slower
#  -- Browser support not available
#  -- Tree Shaking support not available 
# 3. Using ES Modules (import / export)
#  -- Loads modules asynchronously (better optimized)
#  -- Works in browser + Node.js
#  -- import x from "./file.js" (ES Modules require .js extension in Node)
#  -- ES Modules (Static) Imports must be at the top level
#  -- Module is parsed first, then executed
#  -- Performace faster
#  -- Browser support available
#  -- Tree Shaking support available
#  -- Modern tooling support not available
# 4. Data Content (Reading File System)
# 5. NPM (Node Packge Manager)
# 6. Nodejs Event Loop
#  -- (https://www.course-api.com/)
# 7. Async Patterens
# 8. Events
# 9. Streams 
------------------------------------------------
# ++++++++++++++ Express +++++++++++++++
 It provides a structured "routing" layer that saves developers from writing hundreds of lines of repetitive code to handle HTTP methods and URL paths. It remains the "de facto" standard for building APIs in the JavaScript ecosystem.
 # https://expressjs.com/en/5x/starter/installing/
 # commonJS Module
 # 🏛️ Server-Side Rendering (SSR)
 # Api (Http Interface to interact with Data(JSON))
 # 📱 Client-Side Rendering (CSR)
 
 # 1. 01-http-basics
 # 2. 02-http-static-assets (static assets load to server)
 # 3. 03-express-basics
 # 4. 04-express-static-assets (static assets load to server)
 # 5. 05-basic-json => json response to server
 # 6. Server Request => Params-Query
 # 7. Middleware Functions (request => middleware => response)
 # 7. 1. use vs route
 # 7. 2. options - our own / express / third party

 # ----------------------------------------------
 #                 Api Vs SSR
 # Api - JSON , SEND DATA , RES.JSON
 # SSR - TEMPLATE , SEND TEMPLATE , RES.RENDER()
 # ---------------------------------------------- 
 # CRUD => Create(POST) , Read(Get) , Update(PUT), Delete
 # ### 📊 HTTP Methods & Request Body Mapping (CRUD)

  When interacting with our HTTP data interfaces, a **Request Body** payload is only included for operations that write or alter server state (`POST`, `PUT`, `PATCH`). `GET` and `DELETE` requests handle all data passing directly through the URL structure.

  | CRUD Operation | HTTP Method | Body Payload? | Data Transfer Pattern |
  | :--- | :--- | :--- | :--- |
  | **CREATE** | `POST` | **Yes (Mandatory)** | Sent via `req.body` (JSON or URL-Encoded Form) |
  | **READ** | `GET` | **No (Forbidden)** | Passed via `req.params` or `req.query` variables |
  | **UPDATE** | `PUT` / `PATCH` | **Yes (Mandatory)** | Modified key-values passed via `req.body` |
  | **DELETE** | `DELETE` | **No (Rarely)** | Targeted resource specified directly in the URL path |

  #### 💡 REST API Code Standards:
  * **Filtering Data (`GET`):** Use query strings instead of bodies.
    * *Correct:* `GET /api/products?search=sofa` (Handled via `req.query`)
  * **Targeting Resources (`DELETE` / `PUT`):** Use route parameters.
    * *Correct:* `DELETE /api/people/1` (Handled via `req.params.id`)

 # URI (Uniform Resource Identifier)
 # URL (Uniform Resource Locator)
 # All URLs are URIs
 # Anatomy of a URL
 # https://  localhost:3000  /api/products
   └──┬──┘   └──────┬─────┘  └─────┬──────┘
   Protocol      Authority   Path Location
# 1. The Browser Types the Query URL
# http://localhost:3000/?user=afeef
                       └──┬──────┘
                   This is the Query!
# Everything following the ? symbol in a URL is considered a URL query parameter string 
# 2. Express Automatically Parses It
# Express creates this automatically before your middleware runs! req.query = {  user: 'afeef' }







