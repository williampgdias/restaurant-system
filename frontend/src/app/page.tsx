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
        <main className="max-w-6xl mx-auto p-6">
            {/* HEADER */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Grand Menu
                </h1>
                <p className="text-gray-500">
                    Choose your favorite dish to order
                </p>
            </header>

            {/* The Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Food Image Placeholder */}
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">
                                    No Image
                                </span>
                            )}
                        </div>

                        {/* Food Details */}
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-1">
                                {product.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {product.description ||
                                    'a delicious mystery...'}
                            </p>

                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-green-600">
                                    ${product.price.toFixed(2)}
                                </span>

                                {/* The "Add to ticket button" */}
                                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
