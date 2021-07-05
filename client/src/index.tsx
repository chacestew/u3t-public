import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';

import App from './Containers/App';
import client from './micro-sentry';
import registerSW from './registerServiceWorker';

const history = createBrowserHistory();

const rootElement = document.getElementById('root');

render(
  <Router history={history}>
    <App />
  </Router>,
  rootElement
);

registerSW({ onError: (error) => client.report(error) });
