# BagelBot 🥯

## Important External Resources

- [Bagelbot GitLab](https://gitlab.bryx.com/tyler.holewinsi/bagelbot)
- [Bagelbot Deployment](https://bagelbot.erwijet.com/healthcheck)
- [Bagelbot Slack Management](https://api.slack.com/apps/A03K7ABEX4K)
- [Slack Visual Message Builder](https://app.slack.com/block-kit-builder)
- [Bagelbot Container Registry](https://bb.cr.erwijet.com)
- [Bagelbot Deployment Management](https://portainer.csh.erwijet.com)
- [Recommended DB Viewer](https://www.mongodb.com/products/compass)
  - or use `brew install --cask mongodb-compass` if on a mac with `brew.sh` installed

Slack `@tyler` with any questions or for access credentials.

## Tech Stack

Bagelbot is, in essence, an api endpoint for the `Bagelbot` slackbot to interact with. Bagelbot, as an entity, is managed by Slack through the [Bagelbot Slack Management](https://api.slack.com/apps/A03K7ABEX4K) page. We can further define functionality through specified endpoints. This project is the endpoint the bot interacts with.

| Sector            | Technology                                            | Justification                                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Language      | [typescript](https://github.com/microsoft/typescript) | Type safety and seamless integration with other technologies in this project                                                                                                                  |
| API Framework     | [express](https://npmjs.com/package/express)          | Middleware-based routing model, plus general familiarity                                                                                                                                      |
| Bagelbot Database | [mongodb](https://www.mongodb.com/)                   | Mostly to spite `@galen.guyer`, but also familiarity with the [mongoose](https://www.npmjs.com/package/mongoose) modeling tool. Bagelbot implements a fixed-schema data set, despite mongodb. |
| GQL Client        | [urql](https://npmjs.com/package/urql)                | Lightweight alternative to apollo. Limited gql functionality is needed for this project                                                                                                       |

## Endpoint Mappings

| Endpoint                | Description                                                                      |
| ----------------------- | -------------------------------------------------------------------------------- |
| `GET /`                 | Redirects to the `#bagels` channel in bryx slack                                 |
| `GET /healthcheck`      | Flexible endpoint designed for confirming a `200` response                       |
| `POST /interaction`     | Handles any slack interaction performed (such as clicking buttons in forms, etc) |
| `POST /event`           | Handles scoped slack events performed (such as `@BagelBot` mentions, etc)        |
| `POST /slash/<command>` | Handles the corresponding slash command, such as `/register`, `/pay`, etc        |

## Project Structure

| Path                     | Purpose                                                                                                                                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@types/`                | Exposes non-scoped type declarations to be used anywhere in the project                                                                                                                                                                                   |
| `gql/`                   | Prebuilt GQL queries for fetching data from the Balsam Bagel ToastTab GQL endpoint                                                                                                                                                                        |
| `src/balsam`             | Logic relating to interacting with Balsam Bagels (and their gql endpoint)                                                                                                                                                                                 |
| `src/db`                 | Models and Schemas, as well as logic wrappers for interacting with the Bagelbot DB                                                                                                                                                                        |
| `src/db/models`          | Mongoose model definitions. Should contain a one-to-one file mapping with the `schemas` folder                                                                                                                                                            |
| `src/db/schemas`         | Mongoose schema definitions, for consumption by the `models` folder                                                                                                                                                                                       |
| `src/middlewares`        | Express middlewares, such as validating registration, etc                                                                                                                                                                                                 |
| `src/routes`             | Contains all the routers to be used by the express app. Each folder / file within this directory correspond to a part of the path to be handled. For example, `src/routes/slash/menu.ts` should be set up to handle the `/slash/menu` request, and so on. |
| `slack/`                 | Resources for interacting with Slack                                                                                                                                                                                                                      |
| `slack/blockkit/prefab`  | Static blockkit definitions. See the [Slack Visual Message Builder](https://app.slack.com/block-kit-builder) for context                                                                                                                                  |
| `slack/blockkit/mappers` | Functions that, given a fixed input, returns a blockkit message definition. These are the dynamic counterparts to the `prefab` messages                                                                                                                   |
