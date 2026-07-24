import express from 'express';

const router = express.Router();

router.get('/documents', (req, res) => {
  res.json({ message: 'document route placeholder' });
});

export default router;
