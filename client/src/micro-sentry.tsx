import { BrowserMicroSentryClient } from '@micro-sentry/browser';

const client = new BrowserMicroSentryClient({
  dsn: process.env.SENTRY_DSN,
});

export default client;
