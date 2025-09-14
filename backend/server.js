const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// ✅ Register the Transaction model
require('./models/Transaction'); // Needed so Mongoose knows about the schema

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartpay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 🔗 Routes
app.use('/api/auth', require('./routes/auth'));

// 🏠 Default route
app.get('/', (req, res) => {
  res.json({ message: 'SmartPay Backend API is running!' });
});

// ❌ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
