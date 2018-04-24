#!/usr/bin/env node
const worker = require('../');
const { middleware } = worker;
const http = require('http');
const port = process.env.PORT || 3000;

worker.load(process.argv[2]);

http.createServer(middleware(worker)).listen(port);

console.log('listening on http://localhost:%s', port);
