// index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const app = express();
const cors = require('cors');
app.use(cors());

// Middlewares
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);
const CategoryRoutes = require('./routes/CategoryRoutes.js');
app.use('/api/categories', CategoryRoutes);
// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
const productRouter = require('./routes/productRouter.js');
app.use('/api/product', productRouter);


// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/test_db'; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected...');
    // Start the server
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });
