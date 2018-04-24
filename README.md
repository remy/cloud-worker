# Cloud Worker

This project is based on the ideas from the Service Worker specification and the CloudFlare Worker project.

## Outline

Create a single worker file that accepts a `fetch` event and calls `event.respondWith` with a promise (such as another `fetch`).

The module can be used as a standalone server (possibly to test CloudFlare Workers) or as middleware in your own projects or can be invoked manually.

## Installation and usage

Cloud Worker requires [Node](https://nodejs.org) and is installed using npm (which comes with node):

```bash
npm install cloud-worker
```

If you want to only write a cloud worker file, then you can use the prebuilt server in your npm scripts like this:

```json
{
  "scripts": {
    "start": "worker index.js"
  }
}
```

…where `index.js` contains your worker. For example, this [cloud-worker demo](https://cloud-worker.now.sh/) waits 3 seconds then sends all request the response from a example.com ([source code](https://cloud-worker.now.sh/_src)).

## Direct usage

The module can be required and used directly, and the (current) API is:

```
const worker = require('cloud-worker');

```

## Behind the scenes

The cloud worker uses Node's [vm](https://nodejs.org/api/vm.html) module to globally scope all of the required API that the service worker-like script would expect.

It waits for a single `addEventListener` for the `fetch` event and triggers that event when the `worker.handler` function is invoked passing in a `event` that contains a [request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

The functionality is provided via the following npm modules:

- `fetch` (and related sub modules including `Request`, `Response`, `Headers`, `FetchError`) via [node-fetch](https://www.npmjs.com/package/node-fetch)
- `Response.redirect` is manually added
- `URL` and `URLSearchParams` via node's internal [url](https://nodejs.org/api/url.html) package
- streams (`ReadableStream`, `WritableStream` and `TransformStream`) via [web-streams-polyfill](https://www.npmjs.com/package/web-streams-polyfill) (though I believe this to be out of date - any user contribution would be grateful here)
- encoding (`TextEncoder` and `TextDecoder`) via [text-encoding](https://www.npmjs.com/package/text-encoding)
- `FetchEvent` is [manually added](https://github.com/remy/cloud-worker/blob/master/lib/FetchEvent.js)

## Licence

- [MIT](https://rem.mit-license.org) / https://rem.mit-license.org
