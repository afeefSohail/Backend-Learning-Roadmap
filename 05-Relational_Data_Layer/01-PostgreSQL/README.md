

# 🐘 PostgreSQL Core Architecture & Relational Database Masterclass

A comprehensive development repository tracking foundational to enterprise-level relational database design using **PostgreSQL 18** via a native **Homebrew macOS workspace** environment. This workspace sidesteps bulky graphical database manager runtimes by leveraging specialized, lightweight terminal workflows (`psql`) coupled with structural schema analysis inside **DBeaver Community Edition**.

---

## 🏗️ Local Environment Infrastructure Architecture

To guarantee high execution speed and eliminate interface sluggishness, this repository defaults entirely to native terminal environments and streamlined visualization tools:
*   **Database Engine:** PostgreSQL 18.x compiled natively for Apple Silicon via Homebrew package manager tools.
*   **Terminal Interface CLI:** `psql` (utilizing direct `-f` execution pathways and `\i` internal script inclusions).
*   **Graphical Management UI:** DBeaver Community Edition (configured for visual Entity-Relationship Diagram mapping and performance index diagnostics).

---

## 📂 Repository File Blueprint & Curriculum Breakdown

### 📁 01-Basics: Foundational Data Structures & Architecture
This module establishes core storage boundaries, custom structural folders (schemas), and basic column property definitions.

*   `01-database.sql` ➔ Automated system provisioning using fail-safe `DROP DATABASE IF EXISTS` and clean `CREATE DATABASE` initialization scripts.
*   `02-database-schema.sql` ➔ Registration of independent database namespaces (`basics`) and initialization of critical micro-extensions like `pgcrypto`.
*   `03-database-table.sql` ➔ Core structural blueprint generation mapping strings, integers, booleans, and row layout definitions.
*   `04-data-types.sql` ➔ Exploration of classic alphanumeric structures including fixed and variable character matrices (`VARCHAR`, `TEXT`).
*   `05-other-data-types.sql` ➔ Implementing enterprise primitives like globally unique identifiers (`UUID`) and binary document stores (`JSONB`) with extraction operators (`->>`).
*   `06-null-empty-string-zero.sql` ➔ Deep architectural analysis mapping differences between blank characters (`''`), absolute absence (`NULL`), and standard `0` metrics.
*   `07-constants.sql` ➔ Restricting parameters at the schema level using default values and string limits.
*   `08-primary-keys.sql` ➔ Implementation of absolute uniqueness across single columns via auto-incrementing serial indices.

### 📁 02-Intermediate: Data Manipulation, Filtering & Pagination
Focuses on writing clean Data Manipulation Language (DML) structures, applying complex row filters, and optimizing application query responses.

*   `01-sql-concepts-base-file.sql` ➔ Baseline scratchpad mapping syntax foundations and comment configurations (`/* multi-line */`).
*   `02-insert-single-row.sql` ➔ Basic text injection practices targeting target column mappings.
*   `03-insert-multiple-rows.sql` ➔ Mass data population using batch arrays to minimize connection handshakes.
*   `04-select.sql` ➔ Basic column projection and data retrieval strategies.
*   `05-where-basic-filter.sql` ➔ Filtering database outputs by implementing standard logic criteria (`=`, `<`, `>`).
*   `06-and-or-not-filters.sql` ➔ Scoping out records using advanced multi-conditional logic trees.
*   `07-like-ilike-patterns.sql` ➔ Utilizing text pattern wildcards (`%`) for precise case-sensitive and case-insensitive string parsing.
*   `08-in-not-in-between.sql` ➔ Constructing array match lists and numerical ranges to prevent redundant logic checking.
*   `09-null-and-is-not-null.sql` ➔ Isolating unassigned values safely via exact `IS NULL` evaluation structures.
*   `10-order-by.sql` ➔ Forcing row sequence predictability over storage engines using sorting modifiers (`ASC`, `DESC`).
*   `11-limit-offset-pagination.sql` ➔ Implementing offset algorithms `(page - 1) * limit` for chunks of application data.
*   `12-update-rows.sql` ➔ Modifying active table metrics via `UPDATE ... SET` commands paired with isolated index filters.
*   `13-delete-rows.sql` ➔ Erasing specific row entries from active storage registers via `DELETE FROM`.
*   `14-returning-query.sql` ➔ Leveraging the PostgreSQL `RETURNING` clause to immediately pass modified records back to application logic without forcing extra lookups.

### 📁 03-Advance: Relational Design, Query Aggregations & Performance
The capstone module shifting away from single tables to tackle complex production architectures, query tuning, and safe transactional data logic.

*   `01-reset-and-seed-relations.sql` ➔ Automated tear-down and environment seeding scripts configured to reset complex multi-table layouts cleanly.
*   `02-foreign-keys.sql` ➔ Injecting relational dependencies and enforcing reference rules via foreign key blocks.
*   `03-one-to-many.sql` ➔ Designing classic primary-to-secondary database links (such as mapping a single user profile to multiple written posts).
*   `04-inner-join.sql` ➔ Querying intersections between related data sets, filtering out records that do not contain matching foreign properties on both sides.
*   `05-left-join.sql` ➔ Preserving primary records by keeping parent table listings active even when optional child data fields evaluate as `NULL`.
*   `06-many-to-many.sql` ➔ Constructing complex bridge/junction entities with compound primary key pairs: `PRIMARY KEY (post_id, tag_id)`.
*   `07-table-aliases.sql` ➔ Writing highly readable, shorthand query structures via code nicknames (`FROM users AS u`).
*   `08-aggregate-func.sql` ➔ Computing mathematical summaries over data fields using `MIN()`, `MAX()`, `SUM()`, and `AVG()`.
*   `09-group-by.sql` ➔ Grouping raw data into logical summaries, applying conditional aggregate filters via the `HAVING` statement.
*   `10-count-distinct.sql` ➔ Isolating true unique occurrences across crowded datasets, weeding out duplicate entries.
*   `11-sub-queries.sql` ➔ Nesting standalone isolation queries directly inside parent operational filters to execute calculations dynamically.
*   `12-indexes.sql` ➔ Bypassing slow, full-table scans by deploying targeted performance indices to speed up query execution times.
*   `13-transactions.sql` ➔ Implementing ACID database safety nets via `BEGIN`, `COMMIT`, and `ROLLBACK` blocks to enforce all-or-nothing operations.

---

## ⚡ Quick-Start Terminal Execution Guide

To re-run any script module file against your local database engine without leaving your terminal environment, execute the following syntax templates:

### 1. Execute an entire Script Automation File:
```bash
psql -U afeefsohail -d postgresql_basics_01 -f 01-Basics/05-other-data-types.sql
```

### 2. Enter the Live Interactive Prompt Room:
```bash
psql -U afeefsohail -d postgresql_basics_01
```

### 3. Run a File from *Inside* the Live Engine Prompt:
```sql
postgresql_basics_01=# \(\i 02-\)Intermediate/11-limit-offset-pagination.sql
```

---

## 💡 Practical Production Insights
*   **The Check Constraint Advantage:** Rather than introducing rigid database `ENUM` blocks that can lock up live databases during future structural alterations, this workspace leverages native `TEXT` types paired with flexible validation boundaries:
    ```sql
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
    ```
*   **Data Layout Tracking:** Relational databases do not preserve chronological row sequence positioning following data operations due to Multi-Version Concurrency Control (MVCC) mechanics. This repository highlights why queries must always be structured using explicit `ORDER BY` qualifiers.

# Relational Data Layer 
# Relational DB :- 
# - Stores the data in tables.
# - When to use Relational DB :- 
# -- Clear Data Structure
# -- Relation Ships , Transactions , Joins
# -- Strong Validation need at DB level 
# -- etc:- Banking , Ecommerce , CRM  Applications
# Non-Relational DB :-   
# - doesn't organise data using connected tables.
# - they acualy use documents, key value pair (etc MongoDB)
# - When to use Non - Relational DB :- 
# -- Data Changes very often
# -- Docs Independent
# -- Not much joints using
# SQL( Structured Query Langyage ) :-
# PostgreSQL CLI :- 
# - Homebrew's PostgreSQL installation does not create a default postgres superuser role on macOS
# -- psql -U afeefsohail -d postgresql_basics_01
# -- exit command => /q
# -- current db command => SELECT current_database();
# -- current db user => SELECT current_user;
# -- PostgreSQL current version => Select version();
# -- List of DataBase => \l
# -- to see tabels => \dt
# - omit the -U and -d flags entirely, as psql defaults to your current system user and matching database name
# -- psql -d postgres -f 01-database.sql
