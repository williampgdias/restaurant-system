import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export const orderRoutes = Router();
const orderController = new OrderController();

orderRoutes.post('/', orderController.create);
