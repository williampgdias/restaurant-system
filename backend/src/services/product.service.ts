import { prisma } from '../lib/prisma';

interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export class ProductService {
    async createProduct(data: CreateProductRequest) {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                imageUrl: data.imageUrl,
            },
        });

        return product;
    }

    async listProducts() {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return products;
    }
}
