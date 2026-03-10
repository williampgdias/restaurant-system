import { MenuBoard } from '@/components/MenuBoard';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
}

async function fetchMenu(): Promise<Product[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
            cache: 'no-store',
        },
    );

    if (!response.ok) {
        throw new Error('Failed to fetch the menu from the kitchen');
    }

    return response.json();
}

export default async function MenuPage() {
    const products = await fetchMenu();

    return (
        <main className="max-w-7xl mx-auto p-6">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Grand Menu
                </h1>
                <p className="text-gray-500">
                    Choose your favorite dish to order
                </p>
            </header>

            <MenuBoard products={products} />
        </main>
    );
}
