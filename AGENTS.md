# Instructions for AI coding assistants

Prends le temps de toujours expliquer tes choix et de proposer des solutions alternatives. Ne te contente pas de générer du code sans explication.

Détaille les étapes pour reproduire le problème ou la solution, et explique les raisons derrière chaque étape. Si tu proposes du code, commente-le pour expliquer ce qu'il fait et pourquoi il est nécessaire.

Lors de toute modification majeure, ajoute une ligne dans le journal d'utilisation de l'IA (`docs/ai-usage-log.md`) pour documenter la décision et les raisons derrière celle-ci. Dans la partie "Result" mais ce que moi en tant qu'humain j'ai gardé/modifié de ta proposition et pourquoi. Fais là obligatoirement relire par un humain avant de la valider.

Ton objectif principale est d'écrire du code et de nous faire gagner du temps en nous permettant de nous concentrer sur la logique métier et les choix d'architecture et de design. Tu dois donc être capable de générer du code de qualité, lisible et maintenable, et de nous aider à améliorer notre architecture et nos choix techniques.

Tu es un assistant de codage, tu ne remplace pas nos choix comporte toi comme un outils managé par un humain.

## Project
<!-- One paragraph: what the system does. -->

## Stack and versions
<!-- Exact versions matter: assistants often mix APIs from different versions. -->
- Backend:
- Web:
- Database / ORM:
- Mobile:
- Test framework:

## Structure
- `src/` — backend and web
- `mobile/` — mobile app
- `docs/` — documentation; `docs/api/openapi.yaml` is the API contract
- `api-tests/` — HTTP request files

## Commands
- Run: 
- Test: 
- Lint/format: 

## Rules
- Keep `docs/api/openapi.yaml` in sync with every API change.
- Business logic goes in the service layer, not in controllers/endpoints.
- Use DTOs for API input/output, never database entities.
- Every endpoint enforces authorization on the server (role **and** ownership).
- Never hard-code secrets; read configuration from the environment.
- Add or update tests for every behaviour change; never weaken a test to make it pass.
- Use schema changes only through migrations.


## Requirements
1. Data & backend

    Relational or document database with a documented data model (diagram in docs/).
    Schema changes are managed by migrations (or an equivalent, versioned mechanism).
    Seed data so a fresh environment is usable immediately.

2. REST API

    OpenAPI specification in docs/api/openapi.yaml (written or generated, but kept accurate).
    Full CRUD for at least 2 entities; correct HTTP methods and status codes.
    Input validation with consistent, structured error responses.
    Pagination on at least one collection endpoint.

3. Web application

    Web UI covering the main use cases for both roles.
    Works with the API (directly, or sharing the same backend services).

4. Security

    Authentication (sessions, JWT, or an external OIDC provider).
    Authorization: at least 2 roles, enforced on the server.
    No secrets in the repository. Secrets are provided by environment or a secret store.
    HTTPS in production; CORS configured deliberately (no * with credentials).

5. Quality

    Automated tests: unit tests for business logic and at least 3 API integration tests.
    CI pipeline (GitHub Actions) builds and tests every pull request.
    Backend (at least) runs in a container (Dockerfile, optionally docker-compose.yml).

6. Cloud deployment

    API and web app deployed to a public cloud and reachable via a public URL.
    Managed (cloud) database in production.
    Deployment is automated from main (CD).
    Logs are accessible; there is a health check endpoint.

7. Mobile app

    Native or cross-platform app (Android, iOS, Flutter, React Native, MAUI, …).
    Logs in against your API and stores the token securely.
    Lists, creates and edits at least one entity through the deployed API.
    Handles loading, errors and no-network state gracefully.

8. AI

    At least one LLM-powered feature with structured (validated) output.
    An agent that uses your API through tools (function calling or an MCP server) to complete a multi-step task for the user.
    Guardrails: the agent acts only with the user's permissions; destructive actions need confirmation.
    API keys for the LLM provider are never shipped in the mobile or web client.

9. Documentation & process

    README.md with: description, architecture diagram, live URLs, how to run locally.
    At least 4 decision records in docs/decisions/.
    Up-to-date docs/ai-usage-log.md.
    Work is done through issues and pull requests; both members commit regularly.
    Repository is public by the final defense.

