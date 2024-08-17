import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!z');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
