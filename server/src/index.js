require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const parseRouter = require('./routes/parse');
const analyseRouter = require('./routes/analyse');
const tailorRouter = require('./routes/tailor');
const exportRouter = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use('/parse', (req, res, next) => {
  upload.single('file')(req, res, next);
}, parseRouter);

app.use('/analyse', analyseRouter);
app.use('/tailor', tailorRouter);
app.use('/export', exportRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`FitCV server running on port ${PORT}`));
