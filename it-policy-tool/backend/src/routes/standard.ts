import express from 'express';
import { prisma } from '../server';

const router = express.Router();

router.get('/', async (req, res) => {
  const { policyId } = req.query;
  const standards = await prisma.standard.findMany({
    where: policyId ? { policyId: String(policyId) } : {},
    include: { sops: true }
  });
  res.json(standards);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const standard = await prisma.standard.findUnique({
    where: { id },
    include: { sops: true, policy: true }
  });
  res.json(standard);
});

router.post('/', async (req, res) => {
  const { title, description, content, policyId } = req.body;
  const standard = await prisma.standard.create({
    data: { title, description, content, policyId }
  });
  res.json(standard);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, content, status } = req.body;
  
  const existingStandard = await prisma.standard.findUnique({ where: { id } });
  
  if (existingStandard && existingStandard.content !== content) {
    await prisma.standardVersion.create({
      data: {
        standardId: id,
        version: existingStandard.version,
        content: existingStandard.content
      }
    });
  }
  
  const standard = await prisma.standard.update({
    where: { id },
    data: { title, description, content, status }
  });
  res.json(standard);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.standard.delete({ where: { id } });
  res.json({ message: 'Standard deleted successfully' });
});

export default router;