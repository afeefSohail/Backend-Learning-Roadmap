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
 # 1. commonJS Module
 # 2. 01-http-basics
 # 3. 02-http-static-assets (static assets load to server)
 # 4. 03-express-basics
 # 5. 04-express-static-assets (static assets load to server)
 # 6. 🏛️ Server-Side Rendering (SSR)
 # 7. Api (Http Interface to interact with Data(JSON))
 # 7. 📱 Client-Side Rendering (CSR)
 # ----------------------------------------------
 #                 Api Vs SSR
 # Api - JSON , SEND DATA , RES.JSON
 # SSR - TEMPLATE , SEND TEMPLATE , RES.RENDER()
 # ---------------------------------------------- 



