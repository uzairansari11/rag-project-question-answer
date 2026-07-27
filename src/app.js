import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notfound.middleware.js';
import AuthRoute from './routes/auth.routes.js';
import ChatRoute from './routes/chat.routes.js';
import CollectionRoute from './routes/collection.route.js';
import DocumentRoute from './routes/document.routes.js';
import MessageRoute from './routes/message.routes.js';
import PodcastRoute from './routes/podcast.route.js';
const app = express();

app.use(express.json());
app.use(cors());
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', AuthRoute);
app.use('/collection', CollectionRoute);
app.use('/documents', DocumentRoute);
app.use('/documents', PodcastRoute);
app.use('/chat', ChatRoute);
app.use('/chat', MessageRoute);

app.use(notFound);
app.use(errorHandler);
export default app;
