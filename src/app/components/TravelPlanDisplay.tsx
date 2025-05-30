// 


import React from "react";
import { TravelPlan } from "../page"; // Import TravelPlan from page.tsx

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
  error: string;
}

const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({ travelPlan, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!travelPlan) {
    return null;
  }

  return (
    <div>
      {travelPlan.hotel_suggestions && travelPlan.hotel_suggestions.length > 0 && (
        <div className="mt-12">
          <h4 className="text-xl font-bold text-white mb-6 text-center">Recommended Hotels</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelPlan.hotel_suggestions.map((hotel, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-gray-700/50"
              >
                <h5 className="font-bold text-white text-lg mb-2">{hotel.name}</h5>
                <p className="text-gray-200">Rating: {hotel.rating}/5</p>
                <p className="text-gray-200">Price per Night: ${hotel.price_per_night.toFixed(2)}</p>
                <p className="text-gray-200">Location: {hotel.location}</p>
                <p className="text-gray-200">Amenities: {hotel.amenities.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {travelPlan.travel_tips && (
        <div className="mt-12">
          <h4 className="text-xl font-bold text-white mb-6 text-center">General Travel Tips</h4>
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-gray-700/50">
            <p className="text-gray-200">Best Time to Visit: {travelPlan.travel_tips.best_time_to_visit}</p>
            <p className="text-gray-200 mt-2">Local Transportation: {travelPlan.travel_tips.local_transportation}</p>
            <p className="text-gray-200 mt-2">Currency: {travelPlan.travel_tips.currency}</p>
            <p className="text-gray-200 mt-2">Language: {travelPlan.travel_tips.language}</p>
            <p className="text-gray-200 mt-2">Emergency Numbers:</p>
            <ul className="list-disc list-inside text-gray-200 mt-2">
              <li>Police: {travelPlan.travel_tips.emergency_numbers.police}</li>
              <li>Ambulance: {travelPlan.travel_tips.emergency_numbers.ambulance}</li>
              <li>Tourist Helpline: {travelPlan.travel_tips.emergency_numbers.tourist_helpline}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPlanDisplay;