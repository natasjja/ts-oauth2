import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server running');
});

app.get('/hi/', async (req, res) => {
  try {
    return res.send({ hi: "hello "});
  } catch (err) {
    return res
      .status(400)
      .send(`There was an issue fetching your data: ${err}`);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});