const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmMGQ4ZGIyODJhYjJlZmMzNDg5ZDEiLCJpYXQiOjE3NTQyMTMzMzcsImV4cCI6MTc1NDgxODEzN30.NhgchosPKqvK1N6WrSho2WBDX40EVRVKxqU_XMmMHQE'; // paste full token
const secret = 'yZ1Tf+xH0A9DPK/0OaRfLJkj1x8ukq3M5SnGoQ2XKfE=';

try {
  const decoded = jwt.verify(token, secret);
  console.log('Valid Token! Decoded:', decoded);
} catch (err) {
  console.error('Invalid token:', err.message);
}
