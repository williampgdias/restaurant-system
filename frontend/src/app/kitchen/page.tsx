'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
    };
}

interface Order {
    id: string;
    tableNumber: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'FINISHED';
    createdAt: string;
    items: OrderItem[];
}

export default function KitchenDisplay() {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
            );
            if (response.ok) {
                const data = await response.json();
                const activeOrders = data.filter(
                    (order: Order) => order.status !== 'FINISHED',
                );
                setOrders(activeOrders);
            }
        } catch (error) {
            console.error('Failed to read the docket rail:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);

        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: string, currentStatus: string) => {
        let nextStatus = 'PENDING';
        if (currentStatus === 'PENDING') nextStatus = 'PREPARING';
        else if (currentStatus === 'PREPARING') nextStatus = 'READY';
        else if (currentStatus === 'READY') nextStatus = 'FINISHED';

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: nextStatus }),
                },
            );

            if (response.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 border-yellow-400 text-yellow-800';
            case 'PREPARING':
                return 'bg-blue-100 border-blue-400 text-blue-800';
            case 'READY':
                return 'bg-green-100 border-green-400 text-green-800';
            default:
                return 'bg-gray-100 border-gray-400 text-gray-800';
        }
    };

    return (
        <main className="min-h-screen bg-gray-900 p-6 font-sans">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                    Kitchen Display System
                </h1>
                <p className="text-gray-400 text-sm mt-1">Live Order Feed</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.length === 0 ? (
                    <p className="text-gray-400 italic">
                        No active orders. Kitchen is quiet...
                    </p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className={`rounded-lg border-t-8 shadow-lg flex flex-col ${getStatusColor(order.status)}`}
                        >
                            {/* Ticket Header */}
                            <div className="p-4 border-b border-black/10 flex justify-between items-center bg-black/5">
                                <span className="font-bold text-xl">
                                    Table {order.tableNumber}
                                </span>
                                <span className="text-xs font-mono bg-black/10 px-2 py-1 rounded">
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleTimeString()}
                                </span>
                            </div>

                            {/* Ticket Items */}
                            <ul className="p-4 grow space-y-3">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-start text-lg font-medium"
                                    >
                                        <span className="font-bold mr-3 border-r border-black/20 pr-3">
                                            {item.quantity}x
                                        </span>
                                        <span>{item.product.name}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            <div className="p-4 bg-black/5 mt-auto">
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, order.status)
                                    }
                                    className="w-full py-3 rounded font-bold uppercase tracking-wider transition-colors bg-black/10 hover:bg-black/20 text-current"
                                >
                                    {order.status === 'PENDING' &&
                                        'Start Preparing'}
                                    {order.status === 'PREPARING' &&
                                        'Mark as Ready'}
                                    {order.status === 'READY' &&
                                        'Finish & Clear'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
