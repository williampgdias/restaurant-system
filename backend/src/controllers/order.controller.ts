import { Request, Response } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service';

export class OrderController {
    async create(req: Request, res: Response) {
        // The Inspector checking the whole ticket
        const createOrderSchema = z.object({
            tableNumber: z.number().positive('Table number must be positive'),
            // Validating an Array of objects!
            items: z
                .array(
                    z.object({
                        productId: z
                            .string()
                            .uuid('Must be a valid Product ID'),
                        quantity: z
                            .number()
                            .int()
                            .positive('Quantity must be at least 1'),
                    }),
                )
                .min(1, 'The order must have at least one item'),
        });

        try {
            // 1. Validate the ticket
            const orderData = createOrderSchema.parse(req.body);

            // 2. Send it to the kitchen
            const orderService = new OrderService();
            const order = await orderService.createOrder(orderData);

            // 3. Ring the bel! Order registered.
            return res.status(201).json(order);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Invalid order ticket',
                    errors: error.format(),
                });
            }
            console.error(error);
            return res.status(500).json({
                message: 'Kitchen confusion while placing order',
            });
        }
    }
}
