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
