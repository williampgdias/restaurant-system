import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

export const productRoutes = Router();
const productController = new ProductController();

productRoutes.post('/', productController.create);

productRoutes.get('/', productController.list);
