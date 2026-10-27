# Project Proposal

## Problem
<!-- Who has what problem? Why does it matter? -->
Many users replace still-functional devices because the software they use no longer supports their operating system, hardware, or required tasks. In many cases, lighter, more configurable, or better-maintained software alternatives exist, but users do not know how to find them. This creates unnecessary electronic waste and additional financial costs.

We propose a collaborative platform where users can discover, compare, and submit software alternatives for specific tasks and devices. The platform will help users keep their existing devices usable for longer while reducing unnecessary hardware replacement.

## Users and roles
| Role | Description | What they can do |
|------|-------------|------------------|
| visitor | A person who is not connected to the platform. | Search for approved software alternatives and view their available information. |
| user | A registered person who wants to keep an old device usable for longer and help others. | Search for alternatives, submit software alternatives linked to tasks and devices, edit or delete their own pending submissions, and rate alternatives. |
| admin | A person responsible for managing the platform and its content. | Approve or reject submissions, validate tasks and devices, manage users and manage roles. |

## User stories

Format: *As a <role>, I want <goal>, so that <benefit>.* Priority: **M**ust / **S**hould / **C**ould / **W**on't.
Create a GitHub issue for each story (use the "User story" issue template) and link it here.

| # | Story | Priority | Milestone | Issue |
|---|-------|----------|-----------|-------|
| 1 | As a visitor, I want to search for approved software alternatives filtered by devices or tasks, so that I can find a solution compatible with my needs. | Must | midterm | #… |
| 2 | As a user, I want to create an account and log in, so that I can contribute content and ratings. | Must | midterm | #… |
| 3 | As a user, I want to submit a software alternative linked to a task and a device, so that other users can benefit from my experience. | Must | midterm | #… |
| 4 | As a user, I want to edit or delete my own submissions, so that I can correct outdated or incorrect information. | Must | midterm | #… |
| 5 | As an admin, I want to approve or reject submitted alternatives, tasks, devices and compatibility information, so that visitors only see reliable content. | Must | final | #… |
| 6 | As an admin, I want to manage users and their roles, so that access to administration features is controlled. | Must | final | #… |
| 7 | As a user, I want to rate software alternatives, so that I can help others find the best alternatives. | Must | final | #… |
| 8 | As a visitor, I want to view the details of an alternative, so that I can check its compatibility and limitations before using it. | Could | final | #… |
| 9 | As a user, I want to filter alternatives by resource consumption, operating system or privacy features, so that I can refine my search. | Should | final | #… |
| 10 | As a user, I want to report outdated or misleading information, so that the platform can remain reliable. | Could | final | #… |
| 11 | As a user, I want to receive notifications when an alternative is updated or my submission is moderated, so that I know when to take action. | Could | final | #… |
| 12 | As a user, I want to scan my device model with my phone camera, so that I can find compatible alternatives without manually entering its details. | Could | final | #… |
| 13 | As a user, I want to compare two alternatives side by side, so that I can choose the most suitable one for my device and task. | Could | final | #… |

### Acceptance criteria

#### Story 1 — Search for alternatives
- **Given** approved alternatives exist for the task “edit text” and the device “old laptop”
- **When** a visitor searches for “edit text” and selects “old laptop”
- **Then** the platform displays only approved alternatives compatible with that task and device.
- **Given** no approved alternative exists for the selected task and device
- **When** a visitor performs the search
- **Then** the platform displays an empty-state message and suggests changing the filters.

#### Story 2 — Create an account and log in
- **Given** a visitor provides a valid unique email address and a valid password
- **When** the visitor submits the registration form
- **Then** an account is created with the default `user` role and the visitor can log in.
- **Given** the email address is already associated with an account
- **When** the visitor submits the registration form
- **Then** the account is not created and a structured error explains that the email is already in use.

#### Story 3 — Submit a software alternative
- **Given** an authenticated user provides a software name, a task, a device and the required compatibility information
- **When** the user submits the proposal
- **Then** the proposal is created with a pending moderation status and is not visible in public search until approved.
- **Given** the user omits the software name or the required task/device association
- **When** the user submits the proposal
- **Then** the request is rejected with validation errors and no incomplete proposal is stored.

#### Story 4 — Edit or delete own submissions
- **Given** a user owns a pending submission
- **When** the user updates its description
- **Then** the changes are saved and the submission remains pending moderation.
- **Given** a user owns a pending submission
- **When** the user deletes the submission
- **Then** the submission is removed and no longer appears in the user's pending submissions.
- **Given** a user tries to update a submission owned by another user
- **When** the update request is sent
- **Then** the API rejects the request with an authorization error and the submission remains unchanged.

#### Story 5 — Moderate submissions
- **Given** a pending alternative contains all required information
- **When** an admin approves it
- **Then** its status becomes approved and it appears in visitor search results.
- **Given** a pending alternative contains incompatible or incomplete information
- **When** an admin rejects it and provides a reason
- **Then** its status becomes rejected, it is not shown in public search, and the submitting user can see the rejection reason.

#### Story 6 — Manage users and roles
- **Given** an admin is authenticated
- **When** the admin changes a user’s role from `user` to `admin`
- **Then** the user receives the new permissions on the next authenticated request.
- **Given** a regular user tries to change another user’s role
- **When** the request is sent to the API
- **Then** the API returns an authorization error and the role remains unchanged.

#### Story 7 — Rate an alternative
- **Given** an authenticated user views an approved alternative
- **When** the user submits a score between 1 and 5 and an optional comment
- **Then** the rating is saved and included in the alternative’s aggregate rating.
- **Given** the user submits a score outside the range 1 to 5 or has already rated the alternative
- **When** the rating request is sent
- **Then** the API rejects the request with a validation error and does not create a duplicate rating.

### Won't this term

- The platform will not install software automatically on a user's device.
- The platform will not replace a device's operating system or diagnose every hardware problem.
- The platform will not guarantee the long-term security, maintenance or availability of third-party software.
- The platform will not support every operating system and hardware configuration in the first version.

## Mobile app use case
<!-- What will users do with the mobile app, and why on a phone? -->

The mobile application allows users to search for software alternatives while they are using or diagnosing an old device. A user may discover that a task is no longer supported and use their phone to search for compatible alternatives, even when the old device cannot access the Internet. The application can cache recently downloaded recommendations so that they remain available in low-connectivity situations. A connected user can also submit a rating.

## AI features
- **LLM feature:**
The user can describe their need in natural language, for example: “I need a lightweight music player for an old Windows laptop with limited memory.” The LLM transforms this request into a validated structured filter containing the task, device constraints, operating system, resource preferences and optional features. The API then uses this filter to search approved alternatives. The LLM output is validated before it is used, and unknown values are not invented.
<!-- e.g. natural-language search → structured filter -->
- **Agent task:**
The user can ask the agent to add a new software recommendation. The agent first searches for existing tasks and devices, asks the user to select or confirm them, validates whether the software already exists, prepares the missing task, device and compatibility records, displays a summary, and submits the proposal only after explicit user confirmation. The agent uses the permissions of the connected user and cannot moderate another user’s content or perform a destructive action without confirmation.
<!-- one sentence, multi-step, uses your API, e.g. "Find … and book it after I confirm" -->

## Plan
| Milestone | Stories / features |
|-----------|--------------------|
| Midterm (week 7) | |
| Final (week 12) | |

## Risks
<!-- What could go wrong, and what will you do about it? -->
