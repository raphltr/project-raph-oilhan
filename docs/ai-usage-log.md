# AI Usage Log

Log every **meaningful** use of AI tools (not tab completions or one-line fixes).
The rules are in `AI-POLICY.md` in the course materials repository.

| Date | Who | Tool | What we asked / delegated | Result: kept / changed / rejected, and why |
|------|-----|------|---------------------------|--------------------------------------------|
| 2026-10-14 | @example | Claude Code | Generate .gitignore for ASP.NET Core | Kept, removed Rider/VS Code entries we don't use |
| 2026-10-27 | @OilhanMercul | Copilot SDK in VS Code | Analyse and restructure the project domain, data model, roles, user stories, priorities and acceptance criteria, then change the data model because the task join table had limited value for the current scope | Proposed a simpler three-role model, explicit 1:N and M:N relationships, seven Must stories and testable unhappy paths. At our request, the task join entity was removed because it had limited usefulness in the first version; a primary task foreign key and a device compatibility join entity were kept to preserve the required relationships. Two Could stories and a Won't scope list were also added.|
| 2026-10-29 | @raphltr | Copilot SDK in VS Code | Complete and simplify the architecture documentation, covering backend layers, authentication, authorization and deployment | Kept the layered backend, JWT bearer authentication, `user`/`admin` roles, ownership checks and agent guardrails. Documented the deployment flow with GitHub Actions, GitHub Container Registry, Render as cloud runtime and Render PostgreSQL. A human must review the password-hashing algorithm and confirm the concrete cloud provider before implementation. |

## Lessons learned
<!-- Where did AI help most? Where did it mislead you? Fill in before each milestone. -->
