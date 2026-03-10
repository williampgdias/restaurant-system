'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
}

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export function MenuBoard({ products }: { products: Product[] }) {
    const [ticketItems, setTicketItems] = useState<OrderItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddToTicket = (product: Product) => {
        setTicketItems((prevTicket) => {
            const existingItem = prevTicket.find(
                (item) => item.productId === product.id,
            );

            if (existingItem) {
                return prevTicket.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [
                ...prevTicket,
                {
                    productId: product.id,
                    name: product.name,
                    quantity: 1,
                    price: product.price,
                },
            ];
        });
    };

    const handleSendOrder = async () => {
        setIsSubmitting(true);

        try {
            const orderPayload = {
                tableNumber: 5,
                items: ticketItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderPayload),
                },
            );

            if (!response.ok) {
                throw new Error('Kitchen rejected the ticket');
            }

            toast.success('Order sent to the kitchen!', {
                description: 'The chef is already preparing your dish.',
            });
            setTicketItems([]);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Oops! The waiter tripped.', {
                description: 'Please try sending your order again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalAmount = ticketItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Menu */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                        <div className="h-48 bg-gray-200 flex items-center justify-center relative w-full">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">
                                    No Image
                                </span>
                            )}
                        </div>
                        <div className="p-4 flex flex-col grow">
                            <h2 className="text-xl font-semibold mb-1">
                                {product.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {product.description ||
                                    'A delicious mystery...'}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-green-600">
                                    ${product.price.toFixed(2)}
                                </span>

                                <button
                                    onClick={() => handleAddToTicket(product)}
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
                                >
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right side: Ticket */}
            <div className="w-full md:w-80 bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
                <h3 className="text-2xl font-bold mb-4 border-b pb-2">
                    Your Ticket
                </h3>

                {ticketItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center my-8">
                        The ticket is empty. Choose a delicious dish!
                    </p>
                ) : (
                    <ul className="space-y-4 mb-6">
                        {ticketItems.map((item) => (
                            <li
                                key={item.productId}
                                className="flex justify-between items-center border-b border-gray-100 pb-2"
                            >
                                <div>
                                    <span className="font-semibold text=sm">
                                        {item.quantity}x
                                    </span>{' '}
                                    {item.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-between items-center font-bold text-xl mt-4 pt-4 border-t">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleSendOrder}
                    disabled={ticketItems.length === 0 || isSubmitting}
                    className="w-full mt-6 bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors flex justify-center items-center"
                >
                    {isSubmitting ? 'Sending to Kitchen...' : 'Send to Kitchen'}
                </button>
            </div>
        </div>
    );
}
