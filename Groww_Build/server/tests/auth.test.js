import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import http from 'node:http';
import { connectDatabase, closeDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { Watchlist } from '../src/models/Watchlist.js';

test('Authentication Flow: Register, Duplicate Prevention, Login, Refresh, Me', async () => {
  await connectDatabase();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let accessToken = null;
  let refreshTokenCookie = null;

  try {
    // 1. Register new user
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Trader',
        email: testEmail,
        password: testPassword,
      }),
    });

    assert.strictEqual(regRes.status, 201);
    const regBody = await regRes.json();
    assert.strictEqual(regBody.success, true);
    assert.strictEqual(regBody.data.user.email, testEmail.toLowerCase());
    assert.strictEqual(regBody.data.user.name, 'Test Trader');
    assert.ok(regBody.data.accessToken);

    // Verify default watchlist was provisioned
    const defaultWl = await Watchlist.findOne({ userId: regBody.data.user.id, isDefault: true });
    assert.ok(defaultWl, 'Default watchlist should be automatically provisioned');

    // Extract cookie
    const setCookieHeader = regRes.headers.get('set-cookie');
    assert.ok(setCookieHeader, 'Set-Cookie header must be present');
    refreshTokenCookie = setCookieHeader.split(';')[0];

    // 2. Reject duplicate registration
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Trader Duplicate',
        email: testEmail,
        password: testPassword,
      }),
    });
    assert.strictEqual(dupRes.status, 409);
    const dupBody = await dupRes.json();
    assert.strictEqual(dupBody.error.code, 'DUPLICATE_EMAIL');

    // 3. Login with credentials
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.strictEqual(loginBody.success, true);
    accessToken = loginBody.data.accessToken;

    // 4. Access protected /auth/me route
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    assert.strictEqual(meRes.status, 200);
    const meBody = await meRes.json();
    assert.strictEqual(meBody.data.user.email, testEmail.toLowerCase());

    // 5. Refresh token using cookie
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: refreshTokenCookie },
    });
    assert.strictEqual(refreshRes.status, 200);
    const refreshBody = await refreshRes.json();
    assert.ok(refreshBody.data.accessToken);

  } finally {
    // Cleanup created test user & watchlist
    await User.deleteMany({ email: testEmail.toLowerCase() });
    await new Promise((resolve) => server.close(resolve));
    await closeDatabase();
  }
});
