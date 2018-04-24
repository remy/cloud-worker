const fetch = require('node-fetch');
const { EventEmitter } = require('events');

module.exports = class FetchEvent {
  constructor(request) {
    this.type = 'fetch';

    if (typeof request === 'string') {
      this.request = new fetch.Request(request);
    } else {
      this.request = request;
    }

    this.until = Promise.resolve();
  }

  waitUntil(promise) {
    this.until = this.until.then(() => promise);
  }

  respondWith(val) {
    this.__promise = Promise.resolve(val);
  }

  resolve() {
    if (!this.__promise) {
      return Promise.resolve();
    }

    return this.until.then(() => this.__promise);
  }
};
