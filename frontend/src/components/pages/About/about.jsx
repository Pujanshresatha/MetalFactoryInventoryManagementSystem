import React from "react";
import logo from "@assets/images/logo.png";


// FeatureCard Component (reusable)
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition duration-300 border-t-4 border-blue-500">
      <div className="text-blue-600 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

const AboutPage = () => {
  const features = [
    {
      title: "Real-Time Tracking",
      description: "Stay updated with instant inventory insights and alerts.",
      icon: "📊",
    },
    {
      title: "Automated Reports",
      description: "Download smart analytics and performance summaries effortlessly.",
      icon: "📋",
    },
    {
      title: "Seamless Online Store",
      description: "Showcase and sell products with an elegant shopping experience.",
      icon: "🛒",
    },
    {
      title: "Order Management",
      description: "Process and fulfill orders with tracking and customer updates.",
      icon: "📆",
    },
    {
      title: "Multi-User Access",
      description: "Control team roles and permissions for better collaboration.",
      icon: "👥",
    },
    {
      title: "Secure Payments",
      description: "Integrate trusted gateways for quick and secure checkouts.",
      icon: "💳",
    },
  ];

  return (
    <>
      {/* About Us Section */}
      <section className="container mx-auto px-5 mt-24">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="md:w-1/2">
            <img
              className="w-full rounded-xl shadow-lg"
              src={logo}
              alt="Inventory Management"
            />
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our inventory management app provides powerful tools to help you
              keep track of inventory, monitor stock levels, and streamline
              operations. Whether you run a small business or a large
              enterprise, InventoryPro is designed to simplify and enhance your
              inventory management experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose InventoryPro?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
