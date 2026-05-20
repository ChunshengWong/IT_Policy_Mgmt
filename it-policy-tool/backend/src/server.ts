import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import policyRoutes from './routes/policy';
import standardRoutes from './routes/standard';
import sopRoutes from './routes/sop';
import regulatoryRoutes from './routes/regulatory';
import comparisonRoutes from './routes/comparison';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/policies', policyRoutes);
app.use('/api/standards', standardRoutes);
app.use('/api/sops', sopRoutes);
app.use('/api/regulatory', regulatoryRoutes);
app.use('/api/comparisons', comparisonRoutes);

app.get('/', (req, res) => {
  res.send('IT Policy Management Tool API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});