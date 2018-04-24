module.exports = {
  noRespondWith: `FetchEvent handler did not call respondWith() before returning, but initiated some asynchronous task. That task will be cancelled and default handling will occur -- the request will be sent unmodified to your origin. Remember that you must call respondWith() *before* the event handler returns, if you don't want default handling. You cannot call it asynchronously later on. If you need to wait for I/O (e.g. a subrequest) before generating a Response, then call respondWith() with a Promise (for the eventual Response) as the argument.`;
}
