// src/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import stellarRoutes from './src/routes/steller.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/stellar', stellarRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
