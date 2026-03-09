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

    async listOrders() {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    }

    async updateStatus(orderId: string, status: string) {
        const order = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status,
            },
        });

        return order;
    }
}
