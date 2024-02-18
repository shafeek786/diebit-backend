const express = require('express');
const jwt = require('jsonwebtoken'); // Assuming JWT authentication
const app = express();

// Load secret key securely (e.g., from environment variables)
const secretKey = process.env.ACCESS_TOKEN || 'your_secret_key_here';

// Middleware function for JWT-based authentication
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Extract token string
   
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded;

    next(); 
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Invalid token or insufficient permissions' });
  }
};

app.use('/secure-route', verifyToken); // Protect a specific route

module.exports = verifyToken;