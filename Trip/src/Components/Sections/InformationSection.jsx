import React from "react";
import usePhotoApi from "../Photo_API/PhotoApi";
import MainPicture from "/MainPicture.webp";

const InformationSection = ({ trip }) => {
  // Check if trip is undefined
  if (!trip) {
    return <p>Loading trip details...</p>;
  }

  const { imageUrl, loading, error } = usePhotoApi(trip.location);
  console.log("Location:", trip.location, "Image URL:", imageUrl);

  return (
    <div className="max-w-4xl h-auto mx-auto shadow-2xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] bg-gradient-to-tr from-slate-500 to-slate-400 ` shadow-slate-700">
      {/* Image with loading state */}
      {loading ? (
        <div className="w-full h-[350px] bg-gray-200 animate-pulse rounded-t-2xl" />
      ) : (
        <img
          src={imageUrl || MainPicture}
          alt={trip.location || "Trip location"}
          className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover rounded-t-2xl transition-transform hover:scale-105"
          onError={(e) => {
            console.log("Image load failed, using fallback");
            e.target.src = MainPicture;
          }}
        />
      )}

      {/* Trip Details */}
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-signature sm:text-3xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
          {trip.location || "Trip Name"}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm sm:text-base font-semibold bg-blue-100 text-blue-800 rounded-full px-4 py-2 transition-all hover:bg-blue-200">
            {trip.duration || "N/A"} Days
          </span>
          <span className="text-sm sm:text-base font-semibold bg-green-100 text-green-800 rounded-full px-4 py-2 transition-all hover:bg-green-200">
            Budget: {trip.budget || "N/A"}
          </span>
          <span className="text-sm sm:text-base font-semibold bg-purple-100 text-purple-800 rounded-full px-4 py-2 transition-all hover:bg-purple-200">
            Companion: {trip.companion || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InformationSection;
