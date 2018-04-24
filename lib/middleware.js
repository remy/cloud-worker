const localNext = (req, res, e) => {
  res.writeHead(500);
  res.end(e.stack);
};

module.exports = worker => (
  req,
  res,
  next = localNext.bind(null, req, res)
) => {
  if (!worker) {
    throw new Error('requires a cloud worker');
  }

  if (worker.loaded() == false) {
    throw new Error('requires a loaded cloud worker');
  }
  worker
    .handler(req)
    .then(async reply => {
      const headers = {};
      for (let [key, value] of reply.headers) {
        headers[key] = value;
      }
      // can't access the original gzip'ed data:
      // https://github.com/w3c/ServiceWorker/issues/339
      // so we remove the encoding and the content length
      // for gzip further down the line
      delete headers['content-encoding']; // remove gzip headers
      delete headers['content-length'];

      res.writeHead(reply.status, headers);
      res.end(await reply.buffer());
    })
    .catch(next);
};
