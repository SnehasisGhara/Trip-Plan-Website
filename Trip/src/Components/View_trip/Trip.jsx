import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { firestore } from '../Firebase/Firebase';
// import toast from 'react-hot-toast';
import InformationSection from '../Sections/InformationSection';
import Hotels from '../Sections/Hotels';
import DailyPlans from '../Sections/DailyPlans';

const Trip = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tripId } = useParams();

  // useEffect(() => {
  //   const fetchTripData = async () => {
  //     try {
  //       const docRef = doc(firestore, "trips", tripId);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         const tripData = docSnap.data(); // Get the document data
  //         setTrip(tripData);
  //       } else {
  //         console.warn("No trip data found in Firestore.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching trip data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTripData();
  // }, [tripId]);
  useEffect(() => {
    console.log("Trip ID from URL:", tripId); // Debugging
    if (!tripId) {
      console.warn("❌ tripId is undefined.");
      setLoading(false);
      return;
    }

    const fetchTripData = async () => {
      setTrip(null);
      setLoading(true)

      // if (!tripId) {
      //   console.warn("tripId is undefined.");
      //   setLoading(false);
      //   return;
      // }

      try {
        const docRef = doc(firestore, "trips", tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const tripData = docSnap.data();
          console.log("Fetched Trip Data:", tripData); // Debugging** 

          console.log("Raw tripDataAI before parsing:", tripData.tripDataAI); //** */

          //*** tripDataAI is parsed correctly

          let parsedTripDataAI = {};
          if (tripData.tripDataAI) {
            try {
              parsedTripDataAI = JSON.parse(tripData.tripDataAI)
              console.log("✅ Parsed tripDataAI:", parsedTripDataAI); // here every Json files are store
            } catch (error) {
              console.error("❌ Failed to parse tripDataAI:", error);
              console.log("Raw tripDataAI:", tripData.tripDataAI);
              return;
            }
          }

          //*** const hotels = parsedTripDataAI.travelPlan?.hotels || []
          const hotels = parsedTripDataAI?.hotels || parsedTripDataAI?.travelPlan?.hotels || parsedTripDataAI?.trip?.hotels || [];
          console.log("Hotels in Trip:", hotels) //Saw hotels

          const dailyPlans = parsedTripDataAI?.itinerary || parsedTripDataAI.travelPlan?.itinerary || parsedTripDataAI?.trip?.itinerary || []
          console.log("DailyPlans is Trip", dailyPlans); //saw DailyPlans



          setTrip({ ...tripData, hotels: [...hotels], dailyPlans: [...dailyPlans], travelPlan: parsedTripDataAI.travelPlan });

          //2 setTrip((prev) => ({ ...prev, hotels, dailyPlans, travelPlan: parsedTripDataAI.travelPlan }));

          // setTrip({
          //   destination: tripData || "",
          //   tripId: tripId,
          //   hotels: hotels,
          //   dailyPlans: dailyPlans,
          //   travelPlan: parsedTripDataAI.travelPlan || {},
          // });
          console.log("🚀 Updated trip state:", {

            tripId,
            hotels,
            dailyPlans,
            travelPlan: parsedTripDataAI.travelPlan,
          });
        } else {
          console.warn("No trip found for ID:", tripId);
          // toast.error("No trip data found.");
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        // toast.error("Error fetching trip details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  return (
    <div className='min-h-screen bg-gray-900/95 pt-28 p-6  lg:p-14'>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
        </div>
      ) : trip ? (
        <div className="max-w-7xl mx-auto space-y-8 m-10">
          <InformationSection trip={trip} />

          {/* Hotels Section */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl border border-gray-700">
            {trip.hotels || trip.hotels.length > 0 ? (
              <>
                {/* <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b border-gray-700 pb-2">
                  <span>🏨</span> Accommodations
                </h2> */}
                <Hotels hotels={trip.hotels} />
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No hotels available</p>
            )}
          </div>

          {/* Daily Plans Section */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl border border-gray-700">
            {trip.dailyPlans || trip.dailyPlans.length > 0 ? (
              <>
                {/* <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b border-gray-700 pb-2">
                  <span>📅</span> Daily Itinerary
                </h2> */}
                <DailyPlans dailyPlans={trip.dailyPlans} />
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No daily plans available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-100">No trip data available</h3>
          <p className="text-gray-400 mt-2">Please try again later or contact support</p>
        </div>
      )}
    </div>
  );
};

export default Trip;