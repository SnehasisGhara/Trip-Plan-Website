import React from "react";
import useFetchPhotoApi from "../Photo_API/FetchPhotoApi";
import { useCart } from "../Context/CartContext";
import { toast } from "@/hooks/use-toast";

const HotelCard = ({ hotel }) => {
  const { imageUrl, loading } = useFetchPhotoApi(`${hotel.name} hotel luxury`);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      ...hotel,
      imageUrl: imageUrl
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="group relative p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900 hover:from-gray-900 hover:to-blue-900 border border-gray-700/50 backdrop-blur-sm">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden rounded-xl">
        {loading ? (
          <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse rounded-xl"></div>
        ) : (
          <>
            <img
              src={imageUrl || '/placeholder-hotel.jpg'}
              alt={hotel.name}
              className="w-full h-48 object-cover rounded-xl transform transition-transform group-hover:scale-110 duration-500"
              onError={(e) => {
                e.target.src = '/placeholder-hotel.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {hotel.name}
        </h3>
        <p className="text-gray-400">{hotel.address || hotel.location}</p>
        <p className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          ₹{hotel.price?.amount || hotel.price || 'N/A'}
        </p>
        <button
          className="w-full mt-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium 
          transform transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg 
          focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Hotels = ({ hotels }) => {
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-signature">
        Luxury Hotels & Stays
      </h2>

      {/* Hotel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {Array.isArray(hotels) && hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Hotels;

