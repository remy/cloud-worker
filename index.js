const util = require('util');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const FetchEvent = require('./lib/FetchEvent');
const { Request } = require('node-fetch');
const sandbox = new (require('./lib/sandbox'))();
const debug = util.debuglog('cloud-worker');

let loaded = false;
function loadScript(filename) {
  filename = path.resolve(process.cwd(), filename);
  debug(`loading ${filename}`);

  loaded = true;

  const code = fs.readFileSync(filename, 'utf8');
  const script = new vm.Script(code, { filename });
  script.runInContext(sandbox.context);

  debug(`loaded ${filename}`);
}

function handler({ url = '/', headers = {}, method = 'GET' } = {}) {
  if (!url.startsWith('http')) {
    url = `https://example.com${url}`;
  }
  const event = new FetchEvent(
    new Request(url, {
      headers,
      method,
    })
  );

  return new Promise((resolve, reject) => {
    debug(`sending request to ${url}`);
    sandbox.emit('fetch', event);

    debug(`handler returned, now resolving`);

    const reply = event.resolve();
    resolve(reply);
  });
}

const worker = (module.exports = {
  loaded: () => loaded,
  load: loadScript,
  handler: handler,
  middleware: () => require('./lib/middleware')(worker),
});
