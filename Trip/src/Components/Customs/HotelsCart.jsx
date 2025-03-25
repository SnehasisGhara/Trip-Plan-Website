import React from 'react';
import { useCart } from '../Context/CartContext';
import { Button } from '@/Components/ui/button';

const HotelsCart = () => {
    const { cart, removeFromCart } = useCart();

    const totalPrice = cart.reduce((total, hotel) => {
        const price = typeof hotel.price === 'object' ? hotel.price.amount : hotel.price;
        return total + (Number(price) || 0);
    }, 0);

    const handleRemove = async (hotelId) => {
        try {
            await removeFromCart(hotelId);
        } catch (error) {
            console.error("Error removing item from cart:", error);
            // You might want to show an error toast here
        }
    };

    return (
        <div className="container mx-auto mt-20 p-7 pt-8">
            <h2 className="text-2xl font-bold mb-4">Hotels Cart</h2>
            {cart.length > 0 ? (
                <div className="space-y-4">
                    {cart.map((hotel) => (
                        <div
                            key={hotel.id}
                            className="flex items-center justify-between p-4 border rounded-lg shadow hover:shadow-md transition-shadow  bg-gradient-to-tr from-amber-400 to-orange-900"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={hotel.imageUrl || '/placeholder-hotel.jpg'}
                                    alt={hotel.name}
                                    className="w-24 h-24 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-hotel.jpg';
                                    }}
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                                    <p className="text-gray-600">{hotel.location}</p>
                                    <p className="text-blue-600 font-medium">
                                        ₹{hotel.price?.amount || hotel.price}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => handleRemove(hotel.id)}
                                className="hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    <div className="mt-6 p-4 border-t">
                        <div className="text-xl font-bold flex justify-between items-center">
                            <span>Total:</span>
                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <Button
                            className="w-full mt-4 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                // Add checkout functionality here
                                alert("Checkout functionality coming soon!");
                            }}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.history.back()}
                    >
                        Continue Checking
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HotelsCart;
