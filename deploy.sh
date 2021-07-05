#!/bin/bash
set -e
npm install
npm run build-all
pm2 startOrReload ecosystem.config.js
