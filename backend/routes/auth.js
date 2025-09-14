// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (!username || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      phoneNumber,
      balance: 1000,
    });

    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ✅ Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("User Fetch Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 💸 Send Money Route
// 💸 Send Money Route
router.post('/send', async (req, res) => {
  const { senderId, receiverEmail, amount } = req.body;

  if (!senderId || !receiverEmail || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Adjust balances
    sender.balance -= amount;
    receiver.balance += amount;

    // Save balances
    await sender.save();
    await receiver.save();

    // Create transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      time: new Date().toLocaleString() // optional
    });
    await transaction.save();

    // Push transaction ID into both users reliably
    const [senderUpdate, receiverUpdate] = await Promise.all([
      User.findByIdAndUpdate(sender._id, {
        $push: { transactions: transaction._id }
      }, { new: true }),
      User.findByIdAndUpdate(receiver._id, {
        $push: { transactions: transaction._id }
      }, { new: true })
    ]);

    if (!senderUpdate || !receiverUpdate) {
      return res.status(500).json({ message: "Failed to link transaction to users" });
    }

    res.status(200).json({ message: "Transaction successful", transaction });

  } catch (err) {
    console.error("Transfer Error:", err);
    res.status(500).json({ message: "Transfer failed", error: err.message });
  }
});

   

module.exports = router;
