# 0002. Choosing OIDC authentication with Keycloak

- **Status:** proposed
- **Date:** 2026-11-09
- **Deciders:** Raph, Oïlhan

## Context

The API must authenticate web, mobile and agent clients with bearer tokens. Managing passwords securely
also involves hashing, password resets, lockout, MFA and token lifecycle
concerns. For that we must use a framework built-in identity or external identity provider.

## Options considered

1. **Keep the custom JWT login** — simple for the prototype, but the
   application remains responsible for passwords and identity security.
2. **Use a framework-provided identity system** — avoids some custom security
   work, but still keeps identity management inside this application and is
   less suitable for sharing authentication with the mobile app and agent.
3. **Use an external OpenID Connect provider with Keycloak** — delegates
   identity management to a dedicated provider, supports standard OAuth 2.0
   and OIDC flows, and can run locally for development.

## Decision

We will migrate the application to **OpenID Connect with Keycloak**. Keycloak
will authenticate users and issue access tokens. The API will accept those
tokens as bearer tokens in the `Authorization` header and validate their
signature, issuer and audience. Application authorization will remain in the
API: roles and resource ownership must still be checked server-side.

The current custom JWT implementation is therefore considered temporary
prototype code and will be replaced during the authentication migration.

When a valid Keycloak token is received for the first time, the API provisions
the corresponding application profile from the token claims. It links an
existing profile by the Keycloak `sub` or email, or creates one with the
subject, email and Keycloak role. This keeps Keycloak as the source of truth
for identity while the API owns application-specific profile data.

## Consequences

- Passwords and login flows are handled by Keycloak rather than by the API.
- Web, mobile and agent clients can use standard OIDC-compatible flows.
- The API must be configured with the Keycloak issuer, audience and signing
  keys, supplied through environment variables.
- Local development requires a Keycloak instance and seeded realms, clients
  and users.
- Application users do not need to be duplicated manually: their profile is
  created on first authenticated use.
- Token validation and authorization need integration tests after the
  migration.
