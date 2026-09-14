import http from 'node:http';
process.env.DATABASE_PATH = './data/probe.sqlite';
const { default: app } = await import('./dist/server.js');
const server = http.createServer(app);
await new Promise((r) => server.listen(3002, r));
try {
  const inq = await fetch('http://localhost:3002/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productCode: 'WABONDO', customerId: '09000879' }),
  }).then((r) => r.json());
  console.log('INQ rc', inq.rc, 'ref2', inq.data?.ref2);
  const pay = await fetch('http://localhost:3002/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productCode: 'WABONDO',
      customerId: inq.data.idpel,
      ref1: inq.data.ref1,
      ref2: inq.data.ref2,
      nominal: String(inq.data.nominal),
    }),
  });
  console.log('PAY status', pay.status);
  console.log(JSON.stringify(await pay.json(), null, 2).slice(0, 1000));
} finally {
  server.close();
}
