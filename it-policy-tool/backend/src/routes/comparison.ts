import express from 'express';
import { prisma } from '../server';

const router = express.Router();

router.get('/', async (req, res) => {
  const comparisons = await prisma.comparison.findMany({
    include: {
      regulatoryReq: true,
      policy: true,
      standard: true,
      sop: true
    }
  });
  res.json(comparisons);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const comparison = await prisma.comparison.findUnique({
    where: { id },
    include: {
      regulatoryReq: true,
      policy: true,
      standard: true,
      sop: true
    }
  });
  res.json(comparison);
});

router.post('/', async (req, res) => {
  const { regulatoryReqId, policyId, standardId, sopId, status, notes } = req.body;
  const comparison = await prisma.comparison.create({
    data: { regulatoryReqId, policyId, standardId, sopId, status, notes }
  });
  res.json(comparison);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { regulatoryReqId, policyId, standardId, sopId, status, notes } = req.body;
  const comparison = await prisma.comparison.update({
    where: { id },
    data: { regulatoryReqId, policyId, standardId, sopId, status, notes }
  });
  res.json(comparison);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.comparison.delete({ where: { id } });
  res.json({ message: 'Comparison deleted successfully' });
});

router.get('/compliance/overview', async (req, res) => {
  const totalRequirements = await prisma.regulatoryRequirement.count();
  const completedComparisons = await prisma.comparison.count({
    where: { status: 'completed' }
  });
  const pendingComparisons = await prisma.comparison.count({
    where: { status: 'pending' }
  });
  
  const complianceRate = totalRequirements > 0 
    ? ((completedComparisons / totalRequirements) * 100).toFixed(2) 
    : '0.00';
  
  res.json({
    totalRequirements,
    completedComparisons,
    pendingComparisons,
    complianceRate
  });
});

export default router;