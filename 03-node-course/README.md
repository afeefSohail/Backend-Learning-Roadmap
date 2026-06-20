# Node.js Fundamentals Tutorial

A structured, hands-on workbook tracking core Node.js concepts, built-in modules, asynchronous runtime behaviors, package management, and event-driven architectures.

---

## 📂 Project Directory Architecture

```text
📁 NODE.JS_EXPRESS.JS
└── 📁 01-node-course
    ├── 📁 01-Intro
    │   ├── 📄 01-intro.js
    │   └── 📄 02-globals-var.js
    ├── 📁 03-Modules
    │   ├── 📁 01-CommonJS_Modules
    │   ├── 📁 02-ES_Modules_(ESM)
    │   ├── 📄 03-os-module.js
    │   ├── 📄 04-path-module.js
    │   ├── 📄 05-fs-sync.js
    │   ├── 📄 06-fs-async.js
    │   └── 📄 07-http-js
    ├── 📁 04-Content
    │   ├── 📁 01-subfolder
    │   ├── 📝 big.txt
    │   ├── 📝 first.txt
    │   ├── 📝 result-async.txt
    │   ├── 📝 result-mind-grenade.txt
    │   ├── 📝 result-sync.txt
    │   └── 📝 second.txt
    ├── 📁 05-npm
    │   └── 📄 05-npm.js
    └── 📁 06-Event-Loop-Examples
        ├── 📄 01-read-file.js
        ├── 📄 02-setTimeout.js
        ├── 📄 03-阻setInterval.js
        ├── 📄 04-server.js
        └── 📕 Nodejs Event Loop.pdf
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
### ⏳ 07-async-patterns
Advanced asynchronous control flows designed to write clean, maintainable, and non-blocking Node code.
* **`01-block.js`**: Demonstrating how synchronous loops block the single thread, freezing the server for all other concurrent users.
* **`02-await-pattern.js`**: Refactoring nested callbacks into Promises and modern `async/await` blocks using Node's utility wrappers (`util.promisify` / `fs.promises`).

### 🔔 08-Events
Deep dive into Node's core event-driven architecture and custom event pipelines.
* **`01-event-emitter.js`**: Initializing the native `EventEmitter` class, listening for events (`.on()`), and dispatching signals (`.emit()`).
* **`02-request-event.js`**: Observing how underlying server instances use internal event listeners behind the scenes to capture user traffic.

### 🌊 09-streams
Handling massive data payloads efficiently without running out of server RAM allocation limits.
* **`01-create-big-file.js`**: A quick utility script designed to generate a heavy text asset (`big.txt`) inside your content folder for streaming practice.
* **`02-streams.js`**: Reading text data in chunks using `createReadStream` instead of reading the entire file into memory at once.
* **`03-http-stream.js`**: Optimizing server network performance by piping a file read stream directly over an HTTP response network pipeline (`.pipe()`).

---

## 🗃️ Global Workspace Configuration Files

* **`node_modules/`**: Local cache directory storing downloaded third-party packages.
* **`.gitignore`**: Version control rules explicitly telling Git to ignore heavy local assets and dependency folders.
* **`package.json`**: Manifest metadata tracking scripts, dependencies, author tags, and entry rules.
* **`package-lock.json`**: Precise dependency version snapshots ensuring cross-environment installation consistency.


---

## 🛠️ Execution Quickstart

To run any script file in this workspace, open your terminal inside the root directory and call the file directly using node:

```bash
cd 01-node-course
node 03-Modules/03-os-module.js

