const express = require('express');
const http = require('http');
const historyFallback = require('connect-history-api-fallback');

const app = express();
const server = http.createServer(app);

app.use(historyFallback({ index: '/index.html' }));

const start = () => {
  const port = 8000;
  server.listen(8000, () => {
    console.info(`Development server listening on http://localhost:${port}`);
  });
};

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack/config.dev');
  const compiler = webpack(config);

  const webpackDevServer = webpackDevMiddleware(compiler, {
    stats: {
      warnings: true,
      colors: true,
      timings: true,
    },
    publicPath: config.output.publicPath,
  });
  app.use(webpackDevServer);
  app.use(webpackHotMiddleware(compiler));

  webpackDevServer.waitUntilValid(start);
} else {
  console.error('Should not be run in production (use nginx)');
  process.exitCode = 1;
}
