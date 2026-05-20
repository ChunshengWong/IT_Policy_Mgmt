import express from 'express';
import { prisma } from '../server';

const router = express.Router();

router.get('/', async (req, res) => {
  const regulatoryRequirements = await prisma.regulatoryRequirement.findMany();
  res.json(regulatoryRequirements);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const requirement = await prisma.regulatoryRequirement.findUnique({
    where: { id },
    include: { comparisons: true }
  });
  res.json(requirement);
});

router.post('/', async (req, res) => {
  const { title, content, source, category, effectiveDate } = req.body;
  const requirement = await prisma.regulatoryRequirement.create({
    data: { title, content, source, category, effectiveDate: new Date(effectiveDate) }
  });
  res.json(requirement);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, source, category, effectiveDate } = req.body;
  const requirement = await prisma.regulatoryRequirement.update({
    where: { id },
    data: { title, content, source, category, effectiveDate: new Date(effectiveDate) }
  });
  res.json(requirement);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.regulatoryRequirement.delete({ where: { id } });
  res.json({ message: 'Regulatory requirement deleted successfully' });
});

export default router;