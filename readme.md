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

## Deployment Lifecycle

To deploy changes to the `bagelbot.erwijet.com` endpoint for testing in the `#bagelbot-playground`, follow these steps.

### Build New Image

1. Make sure docker is running
2. run `yarn deploy`. This will build and push the new image to `bb.cr.erwijet.com:5001`.

### Redeploy Pods

Note that when a pod is killed/restarted, it's replacement will always use the newest image on https://bb.cr.erwijet.com.

There are two options here. The first is to run the `/bbadmin kill pod` (or `/bbadmin kp` for short) command in slack, and bagelbot will kill the running pod. You can check when the pod is back online by navigating to https://bagelbot.erwijet.com/healthcheck. If the result is 404 for 502, then the pod isn't ready yet.

Otherwise, assuming you have a valid `~/.kube/config` file with the correct Roles to interact with the bagelbot kubernetes namespace, you can run the following commands `kubectl rollout restart deployment bagelbot-deployment -n bagelbot`

### Console Monitoring

You may often need to inspect the console output of the live code running at bagelbot.erwijet.com (the version that actually interacts with the slack workspace). Although you can get a lot of information debugging in localhost, a lot of debugging also needs to happen in an actual slack enviornment. To view these logs, you will need a Portainer login. Just slack @tyler and he can set one up for you. Once you have your username and password, go to https://portainer.csh.erwijet.com and sign in. Then, go to the `cassiopeia.erwijet.com` enviornment, click `namespaces` -> `bagelbot` -> `bagelbot-deployment` and at the bottom click `logs`.

Otherwise, you can always use `watch -d -n 1 "kubectl get pods -n bagelbot --no-headers | awk '/bagelbot/{print \$1}' | xargs kubectl logs -n bagelbot"` to view the logs of the current pod if you have `kubectl` set up for the bagelbot namespace.

### Rollout Command

If you are on a mac and have `kubectl` configured, you can install `watch` with `brew install watch` and execute the entire deployment process (build, push, restart, wait for healthcheck) with `yarn rollout` and wait for the healthcheck to show 'OK'.
