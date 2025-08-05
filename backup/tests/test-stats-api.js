// Simple express server to test the account statistics
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Test endpoint to return fixed statistics
app.get('/api/user/stats', (req, res) => {
  // Return fixed statistics that match the screenshot
  res.json({
    messagesSent: 12,
    filesUploaded: 5,
    daysActive: 3
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test statistics endpoint: http://localhost:${PORT}/api/user/stats`);
});

// Keep the server running until user presses Ctrl+C
console.log('Press Ctrl+C to stop the server');
