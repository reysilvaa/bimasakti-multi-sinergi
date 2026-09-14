import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = "test";
process.env.DB_NAME = process.env.DB_TEST_NAME || 'bimasakti_pdam_test';

const { default: app } = await import('./dist/server.js');
const { runMigrations } = await import('./dist/scripts/migrate.js');

await runMigrations();

const mysql = await import('mysql2/promise');
{
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
  });
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
  await conn.execute('TRUNCATE TABLE transactions');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
  await conn.end();
}

const PORT = 3001;

async function runTests() {
  console.log('=== STARTING E2E INTEGRATION TESTS ===\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  const baseUrl = `http://localhost:${PORT}`;

  try {
    console.log('[TEST 1] GET /api/products');
    const prodRes = await fetch(`${baseUrl}/api/products`).then((r) => r.json());
    assert.strictEqual(prodRes.rc, '00', 'Products must return rc 00');
    assert.strictEqual(prodRes.data.length, 2, 'Must have 2 products');
    assert.ok(prodRes.data.every((p) => p.code && p.name && p.defaultIdpel), 'Product shape complete');
    console.log('✓ Products retrieved:', prodRes.data.map((p) => p.code).join(', '));

    console.log('\n[TEST 2] POST /api/inquiry validation failures');
    const badProd = await fetch(`${baseUrl}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCode: 'NOPE', customerId: '01002676' }),
    }).then((r) => r.json());
    assert.strictEqual(badProd.rc, '01', 'Invalid product must return rc 01');
    assert.ok(badProd.ket, 'Must include ket message');

    const noIdpel = await fetch(`${baseUrl}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCode: 'WASDA', customerId: '  ' }),
    }).then((r) => r.json());
    assert.strictEqual(noIdpel.rc, '02', 'Empty idpel must return rc 02');
    console.log('✓ Inquiry validation failures use rc/ket envelope');

    console.log('\n[TEST 3] POST /api/inquiry (PDAM Sidoarjo - WASDA)');
    const inqWasdaRes = await fetch(`${baseUrl}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCode: 'WASDA', customerId: '01002676' }),
    }).then((r) => r.json());

    assert.strictEqual(inqWasdaRes.rc, '00', 'WASDA inquiry must succeed');
    const d = inqWasdaRes.data;
    assert.strictEqual(d.idpel, '01002676');
    assert.strictEqual(d.nominal, 294500, 'Nominal must match 294500');
    assert.strictEqual(d.admin, 10806, 'Admin must match 10806');
    assert.strictEqual(d.total_bayar, 305306, 'Total must match 305306');
    assert.ok(typeof d.data_bill === 'object' && !Array.isArray(d.data_bill), 'data_bill is an object map');
    assert.ok(d.data_bill.blth1, 'data_bill contains blth1');
    assert.strictEqual(typeof d.nomet, 'string', 'nomet is present as string');
    for (const [key, b] of Object.entries(d.data_bill)) {
      assert.ok(key.startsWith('blth'), 'key starts with blth');
      assert.ok(typeof b.air === 'number' && typeof b.denda === 'number', 'bill amounts numeric');
      assert.ok(b.bulan && b.tahun, 'bill period present');
      assert.ok(typeof b.meter_awal === 'number' && typeof b.meter_akhir === 'number', 'meter_awal/akhir numeric');
    }
    assert.ok(d.ref2, 'ref2 must be returned for payment');
    console.log('✓ WASDA inquiry spec-shaped:', { total: d.total_bayar, bills: Object.keys(d.data_bill).length, ref2: d.ref2 });

    console.log('\n[TEST 4] POST /api/inquiry (PDAM Bondowoso - WABONDO)');
    const inqWabondoRes = await fetch(`${baseUrl}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCode: 'WABONDO', customerId: '09000879' }),
    }).then((r) => r.json());

    assert.strictEqual(inqWabondoRes.rc, '00', 'WABONDO inquiry must succeed');
    const w = inqWabondoRes.data;
    assert.strictEqual(w.idpel, '09000879');
    assert.strictEqual(w.nominal, 94130);
    assert.strictEqual(w.admin, 7500);
    assert.strictEqual(w.total_bayar, 101630);
    const billsList = Object.values(w.data_bill);
    const nonair = billsList.reduce((a, b) => a + b.nonair, 0);
    const meter = billsList.reduce((a, b) => a + Math.max(0, b.meter_akhir - b.meter_awal), 0);
    assert.ok(nonair > 0, 'WABONDO has non-air charges');
    assert.ok(meter > 0, 'WABONDO has meter usage');
    console.log('✓ WABONDO inquiry:', { total: w.total_bayar, nonair, meter });

    console.log('\n[TEST 5] POST /api/payment (PDAM Bondowoso) + receipt spec format');
    const payRes = await fetch(`${baseUrl}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productCode: 'WABONDO',
        customerId: w.idpel,
        ref1: w.ref1,
        ref2: w.ref2,
        nominal: w.nominal.toString(),
      }),
    }).then((r) => r.json());

    assert.strictEqual(payRes.rc, '00', 'Payment must succeed');
    const tx = payRes.data.transaction;
    assert.ok(tx.id > 0, 'Transaction ID must be saved in DB');
    assert.strictEqual(tx.status, '00');
    assert.strictEqual(tx.pdamName, 'PDAM BONDOWOSO', 'pdamName from single source');
    const txId = tx.id;

    const receiptText = payRes.data.receiptText;
    console.log('Generated Struk:\n-------------------------------------\n' + receiptText + '\n-------------------------------------');
    assert.ok(receiptText.includes('STRUK PEMBAYARAN PDAM BONDOWOSO'), 'Header');
    assert.ok(/TANGGAL\s+:\s+\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/.test(receiptText), 'TANGGAL dd-mm-yyyy hh:mm:ss');
    assert.ok(receiptText.includes('NAMA PAM       : PDAM BONDOWOSO'), 'NAMA PAM');
    assert.ok(receiptText.includes('NO. PELANGGAN  : 09000879'), 'NO. PELANGGAN');
    assert.ok(receiptText.includes('PEMAKAIAN'), 'PEMAKAIAN for Bondowoso');
    assert.ok(/AGS\s*\d{2,4}\s+:\s*Rp/.test(receiptText) || /RINCIAN TAGIHAN/.test(receiptText), 'Period rows');
    assert.ok(receiptText.includes('BEBAN'), 'BEBAN for Bondowoso');
    assert.ok(/ADMIN\s+:\s*Rp\s+7\.500/.test(receiptText), 'ADMIN dotted');
    assert.ok(/TOTAL TAGIHAN\s+:\s*Rp\s+101\.630/.test(receiptText), 'TOTAL dotted');
    assert.ok(receiptText.includes('SERATUS SATU RIBU'), 'TERBILANG');
    assert.ok(receiptText.includes('PDAM BONDOWOSO MENYATAKAN STRUK INI'), 'Footer 1');
    assert.ok(receiptText.includes('SEBAGAI BUKTI PEMBAYARAN YANG SAH'), 'Footer 2');
    console.log('✓ Payment stored + receipt matches PDF spec layout');

    console.log('\n[TEST 6] POST /api/payment idempotency (same ref2 must be rejected)');
    const replayRes = await fetch(`${baseUrl}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productCode: 'WABONDO',
        customerId: w.idpel,
        ref1: w.ref1,
        ref2: w.ref2,
        nominal: w.nominal.toString(),
      }),
    }).then((r) => r.json());
    assert.strictEqual(replayRes.rc, '33', 'Replay must return rc 33');
    assert.strictEqual(replayRes.data.transaction.ref2, w.ref2, 'Replay returns original transaction');
    const histAfter = await fetch(`${baseUrl}/api/transactions`).then((r) => r.json());
    assert.strictEqual(histAfter.data.filter((t) => t.ref2 === w.ref2).length, 1, 'Exactly one row for ref2');
    console.log('✓ Double-payment blocked by idempotency check (no second DB row)');

    console.log('\n[TEST 7] GET /api/transactions + guard');
    const histRes = await fetch(`${baseUrl}/api/transactions`).then((r) => r.json());
    assert.strictEqual(histRes.rc, '00');
    assert.ok(histRes.data.length >= 1);
    assert.ok(histRes.data.find((t) => t.id === txId), 'Saved transaction in history');

    const badLimit = await fetch(`${baseUrl}/api/transactions?limit=abc`).then((r) => r.json());
    assert.strictEqual(badLimit.rc, '00', 'limit=abc must not crash (fallback 100)');
    console.log('✓ History + NaN limit guard verified, records:', histRes.count ?? histRes.data.length);

    console.log('\n[TEST 8] GET /api/transactions/:id/receipt (download)');
    const dl = await fetch(`${baseUrl}/api/transactions/${txId}/receipt`);
    assert.strictEqual(dl.status, 200);
    assert.strictEqual(dl.headers.get('content-type'), 'text/plain; charset=utf-8');
    const downloadedText = await dl.text();
    assert.strictEqual(downloadedText, receiptText, 'Download matches generated receipt');

    const notFound = await fetch(`${baseUrl}/api/transactions/99999/receipt`);
    assert.strictEqual(notFound.status, 404, 'Missing transaction must 404');
    console.log('✓ Receipt download + 404 path verified');

    console.log('\n[TEST 9] GET / (EJS view engine + modular components)');
    const htmlRes = await fetch(`${baseUrl}/`);
    assert.strictEqual(htmlRes.status, 200, 'Page status 200');
    assert.ok(htmlRes.headers.get('content-type').includes('text/html'), 'Content-type is HTML');
    const htmlText = await htmlRes.text();
    assert.ok(htmlText.includes('id="form-inquiry"'), 'Includes inquiry-form component');
    assert.ok(htmlText.includes('id="receipt-modal"'), 'Includes modal component');
    assert.ok(htmlText.includes('id="section-history"'), 'Includes history component');
    console.log('✓ EJS layout & shadcn-like components rendered cleanly');

    console.log('\n=== ALL 9 INTEGRATION TESTS PASSED ===');
    process.exit(0);
  } catch (err) {
    console.error('TEST ERROR:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests().catch((e) => {
  console.error('TEST FAILED:', e);
  process.exit(1);
});

