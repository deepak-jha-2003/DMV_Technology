// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
