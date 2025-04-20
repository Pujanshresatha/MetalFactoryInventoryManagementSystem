import React from "react";
import { Star } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.bestseller && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            Bestseller
          </div>
        )}
        {product.new && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
            New Arrival
          </div>
        )}
        <button className="absolute right-4 top-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-700">{product.price}</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Add to Cart
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
