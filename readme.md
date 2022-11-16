# BagelBot 🥯

---

- [BagelBot 🥯](#bagelbot-)
  - [Important External Resources](#important-external-resources)
- [Enviornment Variable Requirements](#enviornment-variable-requirements)
  - [Tech Stack](#tech-stack)
  - [Endpoint Mappings](#endpoint-mappings)
  - [Project Structure](#project-structure)
  - [Deployment Steps for bagelbot.erwijet.com](#deployment-steps-for-bagelboterwijetcom)

---

## Important External Resources

- [Bagelbot GitLab](https://gitlab.bryx.com/tyler.holewinsi/bagelbot)
- [Bagelbot Deployment](https://bagelbot.erwijet.com/healthcheck)
- [Bagelbot Slack Management](https://api.slack.com/apps/A03K7ABEX4K)
- [Slack Visual Message Builder](https://app.slack.com/block-kit-builder)
- [Bagelbot Container Registry](https://bb.cr.erwijet.com)
- [Bagelbot Deployment Management](https://portainer.csh.erwijet.com)
- [Recommended DB Viewer](https://www.mongodb.com/products/compass)
  - or use `brew install --cask mongodb-compass` if on a mac with `brew.sh` installed

# Enviornment Variable Requirements

Running an instance of `bagelbotdev/api` requires the following enviornment variables specified, typically in a top-level `.env` file.

| Name               | Purpose                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `MONGO_URL`        | The mongodb connection string with credentials specified                                 |
| `COIN_ENDPOINT`    | The coin api endpoint to interact with. Typically, this is http://bryxcoin01.csh.rit.edu |
| `SLACKBOT_WEBHOOK` | The webhook to interact with when sending messages to slack channels                     |

Slack `@tyler` with any questions or for access credentials.

## Tech Stack

| Sector            | Technology                                            | Justification                                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Language      | [typescript](https://github.com/microsoft/typescript) | Type safety and seamless integration with other technologies in this project                                                                                                                  |
| API Framework     | [express](https://npmjs.com/package/express)          | Middleware-based routing model, plus general familiarity                                                                                                                                      |
| Bagelbot Database | [mongodb](https://www.mongodb.com/)                   | Mostly to spite `@galen.guyer`, but also familiarity with the [mongoose](https://www.npmjs.com/package/mongoose) modeling tool. Bagelbot implements a fixed-schema data set, despite mongodb. |
| GQL Client        | [urql](https://npmjs.com/package/urql)                | Lightweight alternative to apollo. Limited gql functionality is needed for this project                                                                                                       |

## Endpoint Mappings

| Endpoint                | Description                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /`                 | Redirects to the `#bagels` channel in bryx slack                                                                                                                                                                                |
| `GET /kube`             | Redirects to the kubernetes dashboard for bagelbot. Note that this requires `kubectl proxy` to be running on the developer's machine, as well as a `~/.kube/config` that grants access to the underlying deployed api instance. |
| `GET /dashboard`        | Redirects to the bagelbot dashboard                                                                                                                                                                                             |
| `GET /healthcheck`      | Flexible endpoint designed for confirming a `200` response                                                                                                                                                                      |
| `POST /interaction`     | Handles any slack interaction performed (such as clicking buttons in forms, etc)                                                                                                                                                |
| `POST /event`           | Handles scoped slack events performed (such as `@BagelBot` mentions, etc)                                                                                                                                                       |
| `POST /slash/<command>` | Handles the corresponding slash command, such as `/register`, `/pay`, etc                                                                                                                                                       |
| `GET /v1/users`         | Returns the first name, last name, and slack id of all registered users                                                                                                                                                         |
| `GET /v1/tabs`          | Get the opener's fullname, opened at timestamp, cartGuid, and closed status of all past and current tabs                                                                                                                        |
| `GET /v1/coin`          | Returns the first name, last name, and coin balance for each registed user                                                                                                                                                      |

## Project Structure

| Path                     | Purpose                                                                                                                                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@types/`                | Exposes non-scoped type declarations to be used anywhere in the project                                                                                                                                                                                   |
| `gql/`                   | Prebuilt GQL queries for fetching data from the Balsam Bagel ToastTab GQL endpoint                                                                                                                                                                        |
| `src/balsam`             | Logic relating to interacting with Balsam Bagels (and their gql endpoint)                                                                                                                                                                                 |
| `src/db`                 | Models and Schemas, as well as logic wrappers for interacting with the Bagelbot DB                                                                                                                                                                        |
| `src/coin`               | Logic for interacting with the underlying coin blockchain                                                                                                                                                                                                 |
| `src/db/models`          | Mongoose model definitions. Should contain a one-to-one file mapping with the `schemas` folder                                                                                                                                                            |
| `src/db/schemas`         | Mongoose schema definitions, for consumption by the `models` folder                                                                                                                                                                                       |
| `src/middlewares`        | Express middlewares, such as validating registration, etc                                                                                                                                                                                                 |
| `src/routes`             | Contains all the routers to be used by the express app. Each folder / file within this directory correspond to a part of the path to be handled. For example, `src/routes/slash/menu.ts` should be set up to handle the `/slash/menu` request, and so on. |
| `slack/`                 | Resources for interacting with Slack                                                                                                                                                                                                                      |
| `slack/blockkit/prefab`  | Static blockkit definitions. See the [Slack Visual Message Builder](https://app.slack.com/block-kit-builder) for context                                                                                                                                  |
| `slack/blockkit/mappers` | Functions that, given a fixed input, returns a blockkit message definition. These are the dynamic counterparts to the `prefab` messages                                                                                                                   |

## Deployment Steps for bagelbot.erwijet.com

The production enviornment is not tied to github CI/CD. The purpose of this, is that often times chagnes need to be tested before committing. In the furture, we may have a speerate bot that acts as a "staging" enviornment, but it is nearly impossible to replicate a staging slack enviornment for development. As such, the production enviornment acts as a staging enviornment.

Production deployment prerequisites:

1. The `yarn`, `kubectl`, and `docker` cli tools are all installed and accessable in `$PATH`.
2. Your local container runtime is up.
3. You have access to the underlying kubernetes cluster (specifed in your local `~/.kube/config`)
4. You are logged in to the relevant container registry. You can do this with `docker login ghcr.io/bagelbotdev`

Once you have confirmed you meet the prereqs, you can deploy the current working version of the codebase to production with `yarn rollout` which will automatically perform the following steps:

1. Build the current version of the codebase into an image tagged with `:latest`.
2. Push the newly created image to the container registry.
3. Restartes the kubernetes api deployment which will trigger an image re-pull.
4. Executes a healthcheck probe twice a second to check when the deployment is back online. When the response changes from `404 not found` or `Bad Gateway` to `OK`, the deployment is complete!
