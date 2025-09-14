const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartPay Backend API is running!',
    status: 'success',
    dependencies: {
      express: 'loaded',
      mongoose: 'loaded',
      cors: 'loaded',
      bodyParser: 'loaded'
    }
  });
});

// Test auth route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

console.log('Starting server on port', PORT);
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ API endpoint: http://localhost:${PORT}`);
  console.log('✅ All dependencies loaded successfully!');
});

// Test MongoDB connection (optional)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartpay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.log('⚠️  MongoDB connection error (this is OK for testing):', err.message));
