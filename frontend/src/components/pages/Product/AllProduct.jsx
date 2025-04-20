import React from "react";
import ProductCard from "../Home/UI/ProductCard";
import slide3 from '@assets/images/slide3.jpeg';
import metal_1 from '@assets/images/metal_door.jpg';
import metal_2 from '@assets/images/metal_gate.jpg';
import metal_3 from '@assets/images/metal_swing.jpg';

const sampleProducts = [
    {
      id: 1,
      name: "Main Gate",
      description: "High-quality noise-canceling wireless headphones with 20-hour battery life.",
      price: "Rs.20,000 /-",
      rating: 4.5,
      image: slide3,
      bestseller: true
    },
    {
      id: 2,
      name: "Modern Gate",
      description: "Feature-packed smartwatch with heart rate monitoring and GPS.",
      price: "Rs.20,000 /-",
      rating: 4.2,
      image: metal_1,
      new: true
    },
    {
      id: 3,
      name: "Woodern Gate",
      description: "Portable waterproof speaker with rich sound and 12-hour playback.",
      price: "Rs.20,000 /-",
      rating: 4.0,
      image: metal_2
    },
    {
      id: 4,
      name: "Metals Swing",
      description: "Durable backpack with padded compartments for laptop and accessories.",
      price: "Rs.20,000 /-",
      rating: 4.3,
      image: metal_3
    }
  ];

function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
