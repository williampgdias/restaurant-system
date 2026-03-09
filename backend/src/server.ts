import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { productRoutes } from './routes/product.routes';

const app = express();
const SERVER_PORT = 3333;

app.use(cors());
app.use(express.json());

app.get('/status', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'Online',
        timestamp: new Date().toISOString(),
        message: 'Kitchen is pre-heated and ready to cook!',
    });
});

app.use('/products', productRoutes);

app.listen(SERVER_PORT, () => {
    console.log(`🚀 Server whistling at http://localhost:${SERVER_PORT}`);
});
