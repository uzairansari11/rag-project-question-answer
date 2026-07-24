import express from 'express';

const router = express.Router();

router.post('/chat', (req, res) => {
  res.json({ message: 'chat route placeholder' });
});

export default router;
