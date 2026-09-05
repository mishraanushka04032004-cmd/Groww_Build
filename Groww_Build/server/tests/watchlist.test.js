import test from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import http from 'node:http';
import { connectDatabase, closeDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { Watchlist } from '../src/models/Watchlist.js';
import { WatchlistItem } from '../src/models/WatchlistItem.js';
import { AuthService } from '../src/services/auth/auth.service.js';

test('Watchlist & Dashboard Integration: CRUD, Duplicate Prevention, Dashboard Feed', async () => {
  await connectDatabase();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  const testEmail = `wl_test_${Date.now()}@example.com`;
  const reg = await AuthService.register({
    name: 'Watchlist Tester',
    email: testEmail,
    password: 'Password123!',
  });
  const token = reg.accessToken;
  const userId = reg.user.id;

  try {
    // 1. Get watchlists (Default watchlist exists)
    const wlRes = await fetch(`${baseUrl}/watchlists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(wlRes.status, 200);
    const wlBody = await wlRes.json();
    assert.ok(wlBody.data.length >= 1);
    const defaultWlId = wlBody.data[0].id;

    // 2. Add Stock NVDA
    const addRes = await fetch(`${baseUrl}/watchlists/${defaultWlId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ symbol: 'NVDA', displayName: 'NVIDIA Corp' }),
    });
    assert.strictEqual(addRes.status, 201);
    const addBody = await addRes.json();
    assert.strictEqual(addBody.data.symbol, 'NVDA');

    // 3. Reject duplicate NVDA addition (Compound index)
    const dupRes = await fetch(`${baseUrl}/watchlists/${defaultWlId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ symbol: 'NVDA', displayName: 'NVIDIA Corp' }),
    });
    assert.strictEqual(dupRes.status, 409);
    const dupBody = await dupRes.json();
    assert.strictEqual(dupBody.error.code, 'DUPLICATE_STOCK');

    // 4. Add AAPL and TSLA
    await fetch(`${baseUrl}/watchlists/${defaultWlId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symbol: 'AAPL', displayName: 'Apple Inc' }),
    });
    await fetch(`${baseUrl}/watchlists/${defaultWlId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symbol: 'TSLA', displayName: 'Tesla Inc' }),
    });

    // 5. Query GET /api/v1/dashboard
    const dashRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(dashRes.status, 200);
    const dashBody = await dashRes.json();
    assert.strictEqual(dashBody.success, true);
    assert.ok(dashBody.data.prioritizedChanges.length >= 1);

    // NVDA should be prioritized with explanation
    const nvdaChange = dashBody.data.prioritizedChanges.find((c) => c.symbol === 'NVDA');
    assert.ok(nvdaChange);
    assert.ok(nvdaChange.explanation);
    assert.ok(nvdaChange.signals);

    // 6. Acknowledge baseline
    const ackRes = await fetch(`${baseUrl}/dashboard/acknowledge`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symbol: 'NVDA' }),
    });
    assert.strictEqual(ackRes.status, 200);

  } finally {
    // Cleanup
    const userWls = await Watchlist.find({ userId });
    for (const w of userWls) {
      await WatchlistItem.deleteMany({ watchlistId: w._id });
    }
    await Watchlist.deleteMany({ userId });
    await User.deleteOne({ _id: userId });
    await new Promise((resolve) => server.close(resolve));
    await closeDatabase();
  }
});
