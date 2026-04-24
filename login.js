const http = require('http');
const data = JSON.stringify({ email: 'n.nducthangg@gmail.com', password: 'Â!!@@sssdasdas1312' });
const req = http.request('http://localhost:5173/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});
req.write(data);
req.end();
