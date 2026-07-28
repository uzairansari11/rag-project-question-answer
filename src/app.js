import cors from 'cors';
import express from 'express';

import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notfound.middleware.js';

import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import collectionRouter from './routes/collection.route.js';
import documentRouter from './routes/document.routes.js';
import flashcardRouter from './routes/flashcard.route.js';
import messageRouter from './routes/message.routes.js';
import podcastRouter from './routes/podcast.route.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use('/collection', collectionRouter);

app.use('/documents', documentRouter);
app.use('/documents', podcastRouter);
app.use('/documents', flashcardRouter);

app.use('/chat', chatRouter);
app.use('/chat', messageRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
