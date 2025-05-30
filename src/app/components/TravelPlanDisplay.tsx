import React, { useState, useEffect } from "react";

interface MustVisit {
  attraction: string;
  crowd_info: string;
  recommended_time: string;
}

interface DailyPlan {
  weather: string;
  breakfast: string;
  must_visit: MustVisit;
  local_event: string;
  dinner: string;
  hotel_suggestion: string;
  travel_distance: string;
}

interface TravelPlan {
  destination: string;
  itinerary: { [key: string]: DailyPlan };
  estimated_cost: number;
  hotel_suggestions: string[];
  total_days: number;
}

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
  error: string;
}

const TravelPlanDisplay: React.FC<TravelPlanDisplayProps> = ({ travelPlan, loading, error }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (travelPlan) setCurrentPage(1); // Reset to first page when new plan loads
  }, [travelPlan]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!travelPlan) return null;

  const totalPages = Math.ceil(Object.keys(travelPlan.itinerary).length / itemsPerPage);
  const currentDays = Object.entries(travelPlan.itinerary).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCurrentDayPlan = () => {
    return currentDays.length > 0 ? currentDays[0][1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{travelPlan.destination}</h3>
        <p className="text-green-400 font-medium text-lg">
          Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
        </p>
      </div>

      {currentDays.map(([day, plan]) => (
        <div key={day} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl shadow-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-white">{day}</h4>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              {plan.weather || "N/A"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h5 className="font-semibold text-blue-400">Main Attraction</h5>
                </div>
                <p className="text-gray-200">{plan.must_visit?.attraction || "N/A"}</p>
                <p className="text-sm text-gray-400 mt-1">{plan.must_visit?.crowd_info || "N/A"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Recommended: {plan.must_visit?.recommended_time || "N/A"}
                </p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h5 className="font-semibold text-purple-400">Local Event</h5>
                </div>
                <p className="text-gray-200">{plan.local_event || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h5 className="font-semibold text-green-400">Dining</h5>
                </div>
                <p className="text-gray-200">{plan.breakfast || "N/A"}</p>
                <p className="text-gray-200 mt-1">{plan.dinner || "N/A"}</p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h5 className="font-semibold text-red-400">Travel Tips</h5>
                </div>
                <ul className="space-y-2 text-gray-200">
                  <li>• Hotel: {plan.hotel_suggestion || "N/A"}</li>
                  <li>• Distance: {plan.travel_distance || "N/A"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } transition-colors`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Reverted "Recommended Hotels" section */}
      {travelPlan.hotel_suggestions && travelPlan.hotel_suggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recommended Hotels</h3>
          <ul className="space-y-2">
            {travelPlan.hotel_suggestions.map((hotel, index) => (
              <li key={index} className="text-gray-200">
                • {hotel}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TravelPlanDisplay;