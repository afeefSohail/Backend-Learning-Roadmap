# Node.js Fundamentals Tutorial

A structured, hands-on workbook tracking core Node.js concepts, built-in modules, asynchronous runtime behaviors, package management, and event-driven architectures.

---

## 📂 Project Directory Architecture

```text
📁 03-node-course
    ├── 📁 01-Intro
    │   ├── 📄 01-intro.js
    │   └── 📄 02-globals-var.js
    │
    ├── 📁 03-Modules
    │   ├── 📁 01-CommonJS_Modules
    │   ├── 📁 02-ES_Modules_(ESM)
    │   ├── 📄 03-os-module.js
    │   ├── 📄 04-path-module.js
    │   ├── 📄 05-fs-sync.js
    │   ├── 📄 06-fs-async.js
    │   └── 📄 07-http-js
    │
    ├── 📁 04-Content
    │   ├── 📁 01-subfolder
    │   ├── 📝 big.txt
    │   ├── 📝 first.txt
    │   ├── 📝 result-async.txt
    │   ├── 📝 result-mind-grenade.txt
    │   ├── 📝 result-sync.txt
    │   └── 📝 second.txt
    │
    ├── 📁 05-npm
    │   └── 📄 05-npm.js
    │
    └── 📁 06-Event-Loop-Examples
    │    ├── 📄 01-read-file.js
    │    ├── 📄 02-setTimeout.js
    │    ├── 📄 03-阻setInterval.js
    │    ├── 📄 04-server.js
    │    └── 📕 Nodejs Event Loop.pdf
    │
    ├── 📁 07-async-patterns          # Event Loop Optimization Tier
    │   ├── 📄 01-block.js           # Demonstrating execution stalling via synchronous loops
    │   └── 📄 02-await-pattern.js   # Resolving blocking threads using Promises & Async/Await
    │
    ├── 📁 08-Events                  # Event-Driven Architecture Engine
    │   ├── 📄 01-event-emitter.js   # Custom pub/sub channels via native 'events' module
    │   └── 📄 02-request-event.js   # Intercepting low-level server request event bindings
    │
    └── 📁 09-streams                 # Large-Scale Binary Data Pipelines
        ├── 📄 01-create-big-file.js # Scripting system tools to generate raw multi-megabyte text files
        ├── 📄 02-streams.js         # Reading chunked raw data streams via ReadableStreams
        └── 📄 03-http-stream.js     # Efficient memory pipelining over HTTP network protocols

```

---

## 📘 Module Breakdown & Learning Concepts

### 🚀 01-Intro
Introduction to the V8 JavaScript engine outside the browser environment.
* **`01-intro.js`**: Basic Node terminal execution environments and control flows.
* **`02-globals-var.js`**: Working with system level globals like `__dirname`, `__filename`, `process`, and `module`.

### 📦 03-Modules
Understanding code isolation, module systems, and native built-in utility modules.
* **`01-CommonJS_Modules/`**: Code sharing patterns using traditional `require()` and `module.exports`.
* **`02-ES_Modules_(ESM)/`**: Modern native ECMAScript design patterns utilizing `import` and `export`.
* **`03-os-module.js`**: Monitoring underlying system metrics (uptime, CPU, free memory) via the native OS module.
* **`04-path-module.js`**: Standardizing cross-platform platform-agnostic file paths with `path.join()`.
* **`05-fs-sync.js`**: Blocking file system operations with `readFileSync` and `writeFileSync`.
* **`06-fs-async.js`**: Non-blocking asynchronous file management using callback handling patterns.
* **`07-http.js`**: Crafting a fundamental, bare-metal server connection interface utilizing `http.createServer`.

### 📂 04-Content
Local scratchpad storage directory mimicking database interactions, text streams, and file reads/writes handled by the `fs` scripts.

### 🛠️ 05-npm
* **`05-npm.js`**: Managing local vs global dependencies, understanding `package.json` setup, semantic versioning (semver), and initial script controls.

### 🔄 06-Event-Loop-Examples
Deep dive into Node's asynchronous concurrency model, offloading capabilities, and loop phase tasks.
* **`01-read-file.js`**: Visualizing offloaded non-blocking I/O file operation events.
* **`02-setTimeout.js` / `03-setInterval.js`**: Tracing timer phases and macro-task delays in execution order.
* **`04-server.js`**: Observing how a running server blocks incoming client requests when running synchronous code loops.
* **`Nodejs Event Loop.pdf`**: Conceptual map breakdown tracing event loops, queues, and background threads.

### 🚀 1. Async Patterns & Stalling Prevention (`07-async-patterns`)
Node.js runs on a single-threaded runtime environment. Stalling the main thread with heavy synchronous math logic or hard file reads completely pauses your API server, blocking every concurrent user interaction loop globally.

* **The Blocking Trap (`01-block.js`):** A raw nested loop or `fs.readFileSync` forces Node's call stack to lock up, meaning users hitting unrelated web endpoints are left waiting indefinitely.
* **The Promise Solution (`02-await-pattern.js`):** By wrapping heavy filesystem operations or background processes into native JavaScript `Promises`, Node shifts the operations to internal system threads (via the libuv thread pool), letting the single-threaded Event Loop process transport network traffic seamlessly.

### 🎛️ 2. Event-Driven Architecture (`08-Events`)
Node.js is built entirely around an asynchronous, event-driven architecture. Instead of sequentially querying processes for updates, your core components emit state announcements that trigger dedicated functional hooks.

* **The EventEmitter Pattern:** Using the native `events` library, you can implement an internal publication/subscription (pub/sub) framework.
  ```javascript
  import EventEmitter from 'node:events';
  const customEmitter = new EventEmitter();

  // Establish a persistent listener channel
  customEmitter.on('response', (name, id) => {
    console.log(`Data payload intercepted for user ${name} with ID: ${id}`);
  });

  // Announce/Emit an event from anywhere in the codebase
  customEmitter.emit('response', 'afeef', 1992);
  ```
* **Order of Execution:** Listeners (`customEmitter.on`) must be declared **before** the events are emitted (`customEmitter.emit`), otherwise the emitted payloads are missed.

### 🌊 3. Memory Optimization via Binary Streams (`09-streams`)
When transmitting a massive multi-megabyte file across a network endpoint, reading the entire item into variable memory at once (`fs.readFileSync`) will instantly overload your server's RAM allocation thresholds.

```text
❌ Bad Practice (Buffered File Read):
[ 100MB File on Disk ] ──► Reads ALL at once into RAM ──► [ Drops server or slows execution ]

✅ Best Practice (Streamed Chunk Read):
[ 100MB File on Disk ] ──► [ 64KB Chunk ] ──► [ 64KB Chunk ] ──► Piped straight to Client Buffer
```

* **Chunked Delivery Buffer Size:** By default, Node's `createReadStream` splits raw data files into small, manageable binary byte arrays of **64KB**.
* **Network Pipelining over HTTP (`03-http-stream.js`):** Instead of waiting for a file read to finish, you pass the output stream segment continuously over the network using `.pipe()`. This keeps your server's active RAM consumption steady at an optimized baseline regardless of file scale:
  ```javascript
  import http from 'node:http';
  import fs from 'node:fs';

  http.createServer((req, res) => {
    const fileStream = fs.createReadStream('./big-file.txt', 'utf-8');
    
    // Smoothly pass data chunks straight to the browser line pipeline
    fileStream.on('open', () => {
      fileStream.pipe(res);
    });
    
    fileStream.on('error', (err) => {
      res.end(err);
    });
  }).listen(3000);
  ```
---

## 🗃️ Global Workspace Configuration Files

* **`node_modules/`**: Local cache directory storing downloaded third-party packages.
* **`.gitignore`**: Version control rules explicitly telling Git to ignore heavy local assets and dependency folders.
* **`package.json`**: Manifest metadata tracking scripts, dependencies, author tags, and entry rules.
* **`package-lock.json`**: Precise dependency version snapshots ensuring cross-environment installation consistency.

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


## 🛠️ Execution Quickstart

To run any script file in this workspace, open your terminal inside the root directory and call the file directly using node:

```bash
cd 03-node-course
node 03-Modules/03-os-module.js