# U3T

[![Lighthouse](./lighthouse.svg)](https://github.com/emazzotta/lighthouse-badges)

U3T is an online multiplayer implementation of the game [Utimate tic-tac-toe](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe) and a [Progressive Web Application](https://web.dev/progressive-web-apps/).

Live link: https://u3t.app

#### Features include:

- Online multiplayer using [Socket.IO](https://socket.io/)
  - Supports rematching, reconnecting, and spectating games
- Offline multiplayer on your device
- Single player against a (desperately bad) AI opponent
- Full mobile support 
  - Installable as an application
  - Works offline via the [service worker](https://developers.google.com/web/fundamentals/primers/service-workers)

## Tech Stack

The entire application is written using [TypeScript](https://www.typescriptlang.org/) and [Node.js 15](https://nodejs.org/).

The frontend UI is built in [React](https://reactjs.org/) and [Styled Components](https://styled-components.com/) and transpiled with custom [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/) configurations. [Workbox](https://developers.google.com/web/tools/workbox) provides the service worker functionality.

The backend API is built in [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) and [Socket.IO](https://socket.io/) and runs via [PM2](https://pm2.keymetrics.io/) in production. Game lobbies are stored in a custom in-memory collection using ES6 Maps.

Infrastructure consists of a single Digital Ocean droplet serving the application over HTTP/2 on nginx and deployed via GitHub Actions.

## Structure

This mono-repo is seperated into `client`, `server`, and `common` directories. 

`client` contains the React UI, `server` contains the Express/Socket.IO backend, and `common` contains shared game logic and types.

Follow these steps to start the application in development mode:

1. Clone this repo
2. From the repo root, run
   1. `npm install-all` (installs modules in each directory)
   2. `npm start` (runs the client webpack dev server and the server via nodemon)
3. Open http://localhost:8000 to view the app
4. Any code changes made will reflect immediately

## Contributing

I am currently not accepting pull-requests, but you are welcome to create an issue for any type of technical question, suggestion or bug report.

If you would like to support development, you can do so (with my thanks!) via the donation link on the [About page](https://u3t.app/about).

