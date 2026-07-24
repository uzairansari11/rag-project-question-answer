import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notfound.middleware.js';
import AuthRoute from './routes/auth.routes.js';
import CollectionRoute from './routes/collection.route.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', AuthRoute);
app.use('/collection', CollectionRoute);

app.use(notFound);
app.use(errorHandler);
export default app;
