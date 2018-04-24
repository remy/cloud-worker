const http = require('http');
const worker = require('./index');
const middleware = worker.middleware;
const port = process.env.PORT || 3000;

worker.load(process.argv[2]);

http.createServer(middleware).listen(port);

console.log('cloud worker listening on http://localhost:%s', port);
