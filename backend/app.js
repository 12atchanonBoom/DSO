// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();

const textRoutes = require('./routes/textRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/texts', textRoutes);
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
