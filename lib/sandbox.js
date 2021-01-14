const EventEmitter = require('events');
const vm = require('vm');
const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const streams = require('web-streams-polyfill');
const crypto = { subtle: require('subtle') };
const { TextEncoder, TextDecoder } = require('text-encoding');
const { Request, Response, Headers, FetchError } = fetch;
const { ReadableStream, WritableStream, TransformStream } = streams;

// add missing Response.redirect
Response.redirect = function(url, status = 302) {
  const headers = new Headers();
  headers.set('Location', url);
  return new Response(null, {
    headers,
    status,
  });
};

class Sandbox extends EventEmitter {
  constructor() {
    super();

    const sandbox = {
      fetch,
      Request,
      Response,
      Headers,
      FetchError,
      URL,
      URLSearchParams,
      TextDecoder,
      TextEncoder,
      crypto,
      console,
      ReadableStream,
      WritableStream,
      TransformStream,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
    };

    sandbox.addEventListener = (event, handler) => {
      // debug('handler set on %s', event);
      this.on(event, handler);
    };

    vm.createContext(sandbox);
    this.context = sandbox;
  }
}

Sandbox.prototype.addEventListener = Sandbox.prototype.addListener;
Sandbox.prototype.removeEventListener = Sandbox.prototype.removeListener;

module.exports = Sandbox;
