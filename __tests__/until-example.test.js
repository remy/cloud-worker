const nock = require('nock');
jest.useFakeTimers();

const lib = require('../index');

test('waitUntil', async () => {
  nock(/example/)
    .get('/')
    .reply(200, '<p>Worked</p>');

  lib.load(__dirname + '/fixtures/until-example.js');

  const start = Date.now();
  const handler = lib.handler();
  jest.runOnlyPendingTimers();

  const res = await handler.then(reply => reply.text());

  expect(res).toBe('<p>Worked</p>'); // example.com was loaded
  expect(setTimeout).toHaveBeenCalledTimes(1); // and it wait-until'ed
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
