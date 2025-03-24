import React, { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
// import { triggerGeminiAPI } from "../Service/AIModel"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, firestore } from '../Firebase/Firebase';
import { set } from 'firebase/database';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';



// places api,geocoding api,geolocation api, places api(new)

const Index = () => {
    const { toast } = useToast()
    const [Query, setQuery] = useState('');
    const [Duration, setDuration] = useState('')
    const [Suggestion, setSuggestion] = useState([])
    const [SelectedBudget, setSelectedBudget] = useState(null)
    const [SelectedCompanion, setSelectedCompanion] = useState(null)
    const [Loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);

    const navigate = useNavigate()

    
    const FetchSuggestion = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSuggestion([])
            return
        }
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`
            )
            const data = await response.json()
            setSuggestion(data)
            console.log(data);

        } catch (error) {
            console.error('Error fetching suggestions:', error)
        }


    }

    // Handle Input Change

    function HandleInputChange(e) {
        const value = e.target.value;
        setQuery(value)
        FetchSuggestion(value)
    }
    // Select a Suggestion
    function HandleSelectSuggestion(Suggestion) {
        setQuery(Suggestion.display_name)
        setSuggestion([])
    }
    // Handle Budget Selection
    function HandleBudgetSelection(budget) {
        setSelectedBudget(budget)
    }
    // Handle Companion Selection
    function HandleCompanionSelection(companion) {
        setSelectedCompanion(companion)
    }

    // Generate Trip:
    const GenerateTrip = async (e) => {
        e.preventDefault();
    
        setLoading(true);
    
        // Check if user is authenticated 
        if (!auth.currentUser) {
            toast({
                title: "Sign In Required",
                description: "Please sign in first to generate a trip!",
                variant: "destructive",
            });
            setLoading(false);
            return; // Stop execution if user is not signed in
        }
    
        if (!Query || !Duration || !SelectedBudget || !SelectedCompanion) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields to generate an itinerary!",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }
    
        const prompt = `Generate a JSON response for a travel plan to ${Query} for ${Duration} days with ${SelectedCompanion} on a ${SelectedBudget} budget. The response should include an array of hotels (name, address, price, image URL, coordinates, rating, description) and an itinerary (places to visit, details, image URL, coordinates, ticket price, travel time between locations).`;
    
        toast({
            title: "Congratulations!",
            description: "Your trip is being generated!",
            variant: "default",
        });
    
        try {
            const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
            if (!apiKey) {
                throw new Error("API key is not configured");
                
            }
    
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-exp"
            });
    
            const result = await model.generateContent(prompt);
            const tripDataAI = await result.response.text();
            console.log("Raw tripDataAI:", tripDataAI);
            const cleanedTripDataAI = tripDataAI.replace(/```json|```/g, "").trim();
            // const tripId = Date.now().toString();
            try {
                JSON.parse(cleanedTripDataAI);
                console.log("✅ Cleaned tripDataAI is valid JSON");
            } catch (error) {
                console.error("❌ Cleaned tripDataAI is NOT valid JSON:", error);
            }

            const tripData = {
                userId: auth.currentUser.uid,
                location: Query,
                duration: Duration,
                budget: SelectedBudget,
                companion: SelectedCompanion,
                tripDataAI: cleanedTripDataAI ,
                createdAt: new Date(),
            };
            const tripRef = await addDoc(collection(firestore, "trips"), tripData);;
            console.log("Stored tripDataAI:", cleanedTripDataAI);
          
            toast({
                title: "Trip Generated Successfully!",
                description: "Redirecting to your trip details...",
                variant: "default",
            });
            //** navigate(`/view-trip/${tripRef.id}`);
            navigate(`/view-trip/${tripRef.id}`, { state: { tripData: tripData } });
            setLoading(false)
        } catch (error) {
            console.error("Error generating trip plan:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to generate trip plan. Please try again.",
                variant: "destructive",
            });
            setLoading(false);
        }
    };
    
    
    return (
        <div className="relative min-h-screen bg-slate-800 flex items-center justify-center">
            {/* Background Image */}
            <img
                src="Create_trip.webp"
                alt="Background Photo"
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Content Container */}
            <div className="relative max-w-4xl z-10 bg-white/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl mx-2 mb-2 lg:mx-auto shadow-lg font-Body mt-24 md:mt-28 xl:mt-27  ">
                <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-orange-600  to-[#460505] text-center mb-4 sm:mb-6"
                >
                    Your Dream Journey Starts Here
                </h1>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-amber-800  to-[#4a0606] text-center text-sm sm:text-lg mb-6 font-bold">
                    Share your travel vibes, and let our planner craft the perfect itinerary for you
                </p>
                {/* Form */}
                <form className="space-y-4 sm:space-y-6">
                    {/* Destination */}
                    <div>
                        <label className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-orange-600  to-[#460505] mb-2">
                            What is your destination of choice?
                        </label>
                        <input
                            type="text"
                            value={Query}
                            onChange={HandleInputChange}
                            placeholder='Type your destination...'
                            className='w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        {Suggestion.length > 0 && (
                            <ul className="absolute w-3/4 bg-gray-800 text-white mt-2 rounded-lg max-h-48 overflow-y-auto z-10">
                                {Suggestion.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => HandleSelectSuggestion(suggestion)}
                                        className="px-4 py-2 hover:bg-blue-500 cursor-pointer"
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}




                    </div>

                    {/* Trip Duration */}
                    <div>
                        <label className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-orange-600  to-[#460505] mb-2">
                            How many days are you planning your trip? (e.g., 3)
                        </label>
                        <input
                            type="number"
                            placeholder="Ex. 3"
                            value={Duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-orange-600  to-[#460505]  mb-2">
                            What is your budget? 💵
                        </label>
                        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">

                            {['💵 Cheap', '💰 Moderate', ' 💸 Luxury'].map((budget) => (
                                <button
                                    key={budget}
                                    type='button'
                                    onClick={() => HandleBudgetSelection(budget)}
                                    className={`px-4 py-2 rounded-lg transition ${SelectedBudget === budget ? 'bg-gradient-to-r from-amber-500 to-orange-900 text-white' : 'bg-gray-800 text-white hover:bg-gradient-to-r from-amber-500 to-orange-900'}`}>
                                    {budget}
                                </button>
                            ))}

                        </div>
                    </div>

                    {/* Travel Companions */}
                    <div>
                        <label className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] via-orange-600  to-[#460505] mb-2">
                            Who do you plan on traveling with on your next adventure?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            {[{ label: '✈️ Just Me', span: 'A sole traveler in exploration' },
                            { label: '🥂 A Couple', span: 'Two travelers in tandem' },
                            { label: '🏡 Family', span: 'A group of fun-loving adventurers' },
                            { label: '⛵ Friends', span: 'A bunch of thrill-seekers' }].map((companion) => (
                                <button
                                    key={companion.label}
                                    type='button'
                                    onClick={() => HandleCompanionSelection(companion.label)}
                                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${SelectedCompanion === companion.label ? 'bg-gradient-to-r from-amber-500 to-orange-900 text-white scale-105'
                                        :
                                        'bg-gray-800 text-white hover:bg-gradient-to-r from-amber-500 to-orange-900 hover:scale-105 shadow-md hover:shadow-gray-800'
                                        }`}
                                    aria-pressed={SelectedCompanion === companion.label}
                                >
                                    {companion.label}
                                    <span className='text-xs sm:text-sm mt-1'>{companion.span}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            type="submit"
                            onClick={GenerateTrip}
                            disabled={Loading}
                            className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-bold px-6 sm:px-8 py-3 rounded-full hover:scale-105 transition-transform"
                        >
                            {Loading ? "Loading..." : "Generate Trip"} {/* ✅ Show "Loading..." */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Index
