const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Farm Bridge API Test Server' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`📡 Try: curl http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server error:', err.message);
  console.error('Full error:', err);
});
