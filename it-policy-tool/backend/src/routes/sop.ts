import express from 'express';
import { prisma } from '../server';

const router = express.Router();

router.get('/', async (req, res) => {
  const { standardId } = req.query;
  const sops = await prisma.sOP.findMany({
    where: standardId ? { standardId: String(standardId) } : {},
    include: { standard: true }
  });
  res.json(sops);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const sop = await prisma.sOP.findUnique({
    where: { id },
    include: { standard: true }
  });
  res.json(sop);
});

router.post('/', async (req, res) => {
  const { title, description, content, standardId } = req.body;
  const sop = await prisma.sOP.create({
    data: { title, description, content, standardId }
  });
  res.json(sop);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, content, status } = req.body;
  
  const existingSop = await prisma.sOP.findUnique({ where: { id } });
  
  if (existingSop && existingSop.content !== content) {
    await prisma.sOPVersion.create({
      data: {
        sopId: id,
        version: existingSop.version,
        content: existingSop.content
      }
    });
  }
  
  const sop = await prisma.sOP.update({
    where: { id },
    data: { title, description, content, status }
  });
  res.json(sop);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.sOP.delete({ where: { id } });
  res.json({ message: 'SOP deleted successfully' });
});

export default router;