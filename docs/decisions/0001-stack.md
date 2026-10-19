# 0001. Choosing the stack

- **Status:** accepted
- **Date:** 2026-10-19
- **Deciders:** Oïlhan

## Context
We need to choose a stack for our project. The stack will determine the technologies we use for the frontend, backend, and database. The decision will impact development speed, scalability, and maintainability.

## Options considered
1. **React/Vite/Node.js/Express/Prisma** — pros : A little familiar with React, large community, simplicity with Vite and Express for the API. Cons: Can be a little messy if not well organised. 

2. **Java/Spring Boot** — pros : Already familiar with Java, strong typing, good for large-scale applications. Cons: Overkill for small projects, slower development speed compared to JavaScript frameworks.

## Decision
We chose **React/Vite/Node.js/Express/Prisma** because it is a popular choice, to also become more familiar with the React ecosystem and its community. Express instead of Next.js will allow us to be more flexible and to have an API lighter and less verbal. And finally it is a nice stack for small projects and it is easy to set up and maintain.

## Consequences
We will need to ensure a good organisation of the project and that we follow best practices for maintainability. We may also need to invest time in learning Vite and Express features and optimizations.

<!--
Copy this file to 0001-short-title.md, 0002-…, etc.
Expected decision records during the course (at least 4):
- 0001 stack (week 2)
- authentication approach (week 5)
- deployment & migrations in production (week 8)
- mobile approach (week 9)
- LLM provider / prompt design (week 10)
- agent design and guardrails (week 11)
-->
