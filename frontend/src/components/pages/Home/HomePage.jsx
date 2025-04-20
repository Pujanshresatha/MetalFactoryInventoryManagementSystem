import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./UI/ProductCard";
import { ChevronRight, Star, TrendingUp, ShoppingBag, Truck, Headphones } from "lucide-react";
import slide1 from '@assets/images/slide1.jpeg';
import slide2 from '@assets/images/slide2.jpeg';
import slide3 from '@assets/images/slide3.jpeg';
import metal_1 from '@assets/images/metal_door.jpg';
import metal_2 from '@assets/images/metal_gate.jpg';
import metal_3 from '@assets/images/metal_swing.jpg';

const images = [slide1, slide2, slide3];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1));
        setFadeIn(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? (fadeIn ? "opacity-100" : "opacity-0") : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center items-start text-white px-12 md:px-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md max-w-xl">
          Premium <span className="text-blue-400">Metal Works</span>
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-lg">
          Handcrafted products with superior durability and elegant designs
        </p>
        <div className="space-x-3">
          <Link
            to="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-md transition duration-300 inline-flex items-center"
          >
            Shop Now <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="bg-transparent border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-blue-700 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-1">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setFadeIn(false);
              setTimeout(() => {
                setCurrentIndex(idx);
                setFadeIn(true);
              }, 500);
            }}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              currentIndex === idx ? "bg-blue-500 w-6" : "bg-white/50 w-4"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedCategories() {
  const categories = [
    { name: "Metal Gates", icon: "🏠", count: "24 Products" },
    { name: "Metal Doors", icon: "🚪", count: "18 Products" },
    { name: "Swing Sets", icon: "🏕️", count: "12 Products" },
    { name: "Railings", icon: "🏢", count: "15 Products" }
  ];
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
          <div className="w-20 h-1 bg-blue-600 mb-4"></div>
          <p className="text-gray-600 max-w-xl">Discover our wide range of high-quality metal products designed for durability and elegance</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} to={`/category/${category.name.toLowerCase().replace(' ', '-')}`} className="group">
              <div className="bg-gray-50 hover:bg-blue-50 rounded-xl p-8 text-center transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">{category.name}</h3>
                <p className="text-gray-500">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'Ornate Metal Gate',
      description: 'Hand-forged with premium steel for lasting durability',
      price: "Rs.20,000 /-",
      image: metal_2,
      rating: 4.5,
      bestseller: true
    },
    {
      id: 2,
      name: 'Security Metal Door',
      description: 'Reinforced design with modern locking systems',
      price: "Rs.20,000 /-",
      image: metal_1,
      rating: 4.0,
    },
    {
      id: 3,
      name: 'Garden Metal Swing',
      description: 'Perfect for outdoor relaxation with weather-resistant finish',
      price: "Rs.20,000 /-",
      image: metal_3,
      rating: 5.0,
      new: true
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <div className="w-20 h-1 bg-blue-600"></div>
          </div>
          <Link to="/shop" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View All Products <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}




function Homepage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  );
}

export default Homepage;