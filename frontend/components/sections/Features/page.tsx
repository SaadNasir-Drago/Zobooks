/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import React from "react";

const RealEstateInterface = () => {
  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buy Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="mb-6 flex justify-center">
                <img
                  src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-agent-lg-1.webp"
                  alt="Buy illustration"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-black">
                Buy a home
              </h3>
              <p className="text-gray-600 mb-6 text-center text-sm">
                Find your place with an immersive photo experience and the most
                listings, including things you won't find anywhere else.
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm">
                  Browse homes
                </button>
              </div>
            </div>

            {/* Sell Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="mb-6 flex justify-center">
                <img
                  src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-sell-lg-1.webp"
                  alt="Sell illustration"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-black">
                Sell a home
              </h3>
              <p className="text-gray-600 mb-6 text-center text-sm">
                No matter what path you take to sell your home, we can help you
                navigate a successful sale.
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm">
                  See your options
                </button>
              </div>
            </div>

            {/* Rent Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="mb-6 flex justify-center">
                <img
                  src="https://www.zillowstatic.com/bedrock/app/uploads/sites/5/2024/04/homepage-spot-rent-lg-1.webp"
                  alt="Rent illustration"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-black">
                Rent a home
              </h3>
              <p className="text-gray-600 mb-6 text-center text-sm">
                We're creating a seamless online experience - from shopping on
                the largest rental network, to applying, to paying rent.
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm">
                  Find rentals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealEstateInterface;
