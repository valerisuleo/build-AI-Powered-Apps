import express from 'express';
import routes from './config/routes';
import { errorHandler } from './lib/errorHandler';
import { customResponses } from './lib/customResponses';

const app = express();

app.use(express.json());
app.use(customResponses);
app.use(routes);
app.use((req, res, next) => res.notFound());
app.use(errorHandler);

export default app;
