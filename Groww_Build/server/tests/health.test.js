import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import http from 'node:http';

test('GET /api/v1/health returns 200 with standard response format', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.status, 'healthy');
    assert.strictEqual(body.data.environment, 'development');
    assert.ok(body.data.timestamp);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
