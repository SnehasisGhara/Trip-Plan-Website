import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Hero = () => {  
 

  return (
    <div className="relative min-h-screen bg-slate-800 flex items-center justify-center">
      {/* Background Image */}
      <img
        src="Heropage.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center px-4 py-8 max-w-md lg:max-w-3xl mx-4 bg-white/30 border border-white/30 rounded-2xl lg:min-h-[60vh] shadow-2xl shadow-slate-900">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-700 to-yellow-950 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 font-signature p-2">
          Explore the World Your Way: Intuitive Travel Planning with AI.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium font-signature">
          AI-powered itineraries that match your pace, passion, and preferences.
        </p>

        {/* Get Started Button */}
        <Link to={"/Create_trip" } >
          <button className="mt-4 bg-gradient-to-r from-red-500 via-orange-700 to-yellow-950 hover:text-black text-slate-100 font-bold py-2 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 rounded-full text-lg sm:text-xl md:text-2xl transition duration-500 ease-in-out font-signature">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
