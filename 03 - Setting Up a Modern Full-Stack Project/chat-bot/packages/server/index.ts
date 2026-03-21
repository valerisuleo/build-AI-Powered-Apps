import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (request: Request, response: Response) => {
  response.send('Hello World!!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

