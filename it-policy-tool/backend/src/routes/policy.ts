import express from 'express';
import { prisma } from '../server';

const router = express.Router();

router.get('/', async (req, res) => {
  const policies = await prisma.policy.findMany({
    include: { standards: true }
  });
  res.json(policies);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const policy = await prisma.policy.findUnique({
    where: { id },
    include: { standards: { include: { sops: true } } }
  });
  res.json(policy);
});

router.post('/', async (req, res) => {
  const { title, description, content } = req.body;
  const policy = await prisma.policy.create({
    data: { title, description, content }
  });
  res.json(policy);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, content, status } = req.body;
  
  const existingPolicy = await prisma.policy.findUnique({ where: { id } });
  
  if (existingPolicy && existingPolicy.content !== content) {
    await prisma.policyVersion.create({
      data: {
        policyId: id,
        version: existingPolicy.version,
        content: existingPolicy.content
      }
    });
  }
  
  const policy = await prisma.policy.update({
    where: { id },
    data: { title, description, content, status }
  });
  res.json(policy);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.policy.delete({ where: { id } });
  res.json({ message: 'Policy deleted successfully' });
});

export default router;