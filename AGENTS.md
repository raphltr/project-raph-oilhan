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
