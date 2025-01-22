// server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['*']
}));
app.use(express.json());

// Routes
const calculatorRouter = require('./route/calculator');
app.use('/calculator', calculatorRouter);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});

// Server Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});