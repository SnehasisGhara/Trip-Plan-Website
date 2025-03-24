import React from "react";
import usePhotoApi from "../Photo_API/PhotoApi";

const PlaceCard = ({ place }) => {
  const location = place.location || place.name || place.place || "Unknown Location";
  const ticketPrice = place.ticketPrice || place.price || place.ticket_price || "N/A";
  const travelTime = place.travelTime || place.travel_time_to_next || place.travel_time || place.travelTimeToNext || "N/A";

  const { imageUrl, loading, error } = usePhotoApi(location);

  return (
    <div className="p-3 rounded-lg shadow-md bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:from-gray-900 hover:via-black hover:to-gray-800 transition-transform duration-500 ease-in-out hover:translate-y-[-2px] border border-gray-700">
      <h4 className="text-lg font-medium text-gray-400">{location}</h4>

      {/* Show Image */}
      {loading ? (
        <p>Loading image...</p>
      ) : error ? (
        <p className="text-red-500">Error loading image: {error}</p>
      ) : imageUrl ? (
        <img src={imageUrl} alt={location} className="w-full h-40 object-cover rounded-lg mt-2" />
      ) : (
        <p>No image available</p>
      )}

      {/* Place Details */}
      {place.details && <p className="text-gray-400 mt-2">{place.details}</p>}

      {/* Ticket Price & Travel Time */}
      {ticketPrice !== "N/A" || travelTime !== "N/A" ? (
        <p className="text-sm text-gray-400 mt-1">
          <strong>🎟 Ticket Price:</strong> {ticketPrice} |{" "}
          <strong>🕒 Travel Time:</strong> {travelTime}
        </p>
      ) : null}

      {/* Notes */}
      {place.notes && <p className="text-gray-600 italic mt-2">📝 Notes: {place.notes}</p>}
    </div>
  );
};

const DailyPlans = ({ dailyPlans }) => {
  // Add a guard clause to handle null/undefined
  if (!dailyPlans || !Array.isArray(dailyPlans)) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Daily Plans</h2>
        <p className="text-gray-500">No daily plans available.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-signature text-center">Daily Plans  </h2>

      {dailyPlans.map((dayPlan, index) => {
        const places = dayPlan?.placesToVisit || dayPlan?.places_to_visit || dayPlan?.activities || dayPlan?.places || [];

        return (
          <div key={index} className="p-4 rounded-lg mb-6 shadow-lg bg-gradient-to-tr from-gray-800 via-gray-900 to-blue-900 hover:from-gray-900 hover:to-blue-900 border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">Day {dayPlan.day || index + 1}</h3>
            {dayPlan.details && <p className="text-gray-700 mt-2">{dayPlan.details}</p>}

            {/* Main Image */}
            {(dayPlan.imageURL || dayPlan.image_url || dayPlan.imageUrl) ? (
              <img
                src={dayPlan.imageURL || dayPlan.image_url || dayPlan.imageUrl}
                alt="Trip"
                className="w-full h-40 object-cover rounded-lg mt-2"
              />
            ) : (
              <p className="text-gray-500 mt-2"></p>
            )}

            <div className="mt-2 space-y-4">
              {places.length > 0 ? (
                places.map((place, i) => (
                  <PlaceCard key={i} place={place} />
                ))
              ) : (
                <p className="text-gray-500">No specific places listed for this day.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyPlans;


