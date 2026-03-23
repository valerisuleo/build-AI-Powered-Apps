import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routes from './config/routes';
import { errorHandler } from './lib/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
