# API tests

The Bruno collection is stored in [`bruno/`](./bruno/). Each `.bru` file is
one HTTP request and its assertions. Commit these files with the project and
open the collection directly in Bruno; do not copy them elsewhere.

## Run the collection

1. Start the API locally on `http://localhost:8080`.
2. In Bruno, choose **Open Collection** and select `api-tests/bruno/`.
3. Select the `local` environment.
4. Use the authentification (/api/auth/login) endpoint for getting the JWT of the admin ("admin@example.com", "AdminPassword123!") and the normal user ("user@example.com", "UserPassword123!")
5. In local.bru : put the user JWT in `userToken` and the admin JWT in `adminToken`. 
6. Right click on the collecion then click on run

The collection covers:

- `GET /health`
- User registration: success, validation (`400`) and duplicate (`409`)
- User list: success, unauthenticated (`401`) and forbidden (`403`)
- User read/update/delete: success, validation, forbidden and not found (`404`)
- Software-alternative list: success and invalid pagination (`400`)
- Software-alternative create: success, validation and unauthenticated (`401`)
- Software-alternative read/update/delete: success, validation, forbidden and not found (`404`)

## Environment variables

The local environment is defined in
[`bruno/environments/local.bru`](./bruno/environments/local.bru).

Update these IDs to match your local database:

- `userToken`: a normal user token, used for ownership and `403` tests
- `adminToken`: an administrator token, used for administrator-only requests
- `userId`: the user represented by `userToken`
- `otherUserId`: another user, used for the `403` test
- `deletableUserId`: a disposable user, used by the `204` delete test
- `alternativeId`: an alternative owned by `userId`
- `pendingAlternativeId`: another user's alternative, that can be modified
- `deletableAlternativeId`: a disposable alternative, used by the `204` delete test
- `otherUserAlternativeId` : use for `403`, modify an alternative that is not yours
- `taskId`: an existing task

Run delete tests last because they permanently remove their target resources.
Do not commit real passwords, tokens or API keys.

Note : AdminToken is used only for testing List users. We can't use adminToken everywhere otherwise the Get user forbidden would work.
