const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ── ROUTES ──
app.use('/api/auth',  require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));

// ── DB ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);