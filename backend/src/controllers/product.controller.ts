import { Request, Response } from 'express';
import { z } from 'zod';
import { ProductService } from '../services/product.service';

export class ProductController {
    async create(req: Request, res: Response) {
        // Zod defines the rules for a valid product
        const createProductSchema = z.object({
            name: z.string().min(2, 'Name is too short'),
            description: z.string().optional(),
            price: z.number().positive('Price must be greater than zero'),
            imageUrl: z.string().url('Must be a valid URL').optional(),
        });

        try {
            // Validate the data coming from the Frontend (req.body)
            const productData = createProductSchema.parse(req.body);

            const productService = new ProductService();
            const product = await productService.createProduct(productData);

            return res.status(201).json(product);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Invalid product data',
                    errors: error.format(),
                });
            }

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const productService = new ProductService();
            const products = await productService.listProducts();

            return res.status(200).json(products);
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    message: 'Kitchen caught fire while fetching the menu',
                });
        }
    }
}
