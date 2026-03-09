import { prisma } from '../lib/prisma';

interface OrderItemRequest {
    productId: string;
    quantity: number;
}

interface CreateOrderRequest {
    tableNumber: number;
    items: OrderItemRequest[];
}

export class OrderService {
    async createOrder({ tableNumber, items }: CreateOrderRequest) {
        const order = await prisma.order.create({
            data: {
                tableNumber: tableNumber,
                // Telling Prisma to create the items linked to this new order
                items: {
                    create: items.map((item) => ({
                        quantity: item.quantity,
                        product: {
                            connect: { id: item.productId },
                        },
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return order;
    }
}
