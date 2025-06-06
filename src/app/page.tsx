"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import TravelForm from "./components/TravelForm";
import TravelPlanDisplay from "./components/TravelPlanDisplay";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { getAuth } from "firebase/auth";

// Define interfaces for TravelPlan and related types
export interface MustVisit {
  attraction: string;
  crowd_info: string;
  recommended_time: string;
}

export interface LocalEvent {
  name: string;
  type: string;
  duration: string;
}

export interface TravelTips {
  morning_activity: string;
  transport: string;
  local_customs: string;
}

export interface DailyPlan {
  weather: string;
  breakfast: string;
  must_visit: MustVisit;
  local_event: LocalEvent;
  dinner: string;
  travel_tips: TravelTips;
}

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  tourist_helpline: string;
}

export interface GeneralTravelTips {
  best_time_to_visit: string;
  local_transportation: string;
  currency: string;
  language: string;
  emergency_numbers: EmergencyNumbers;
}

export interface HotelSuggestion {
  name: string;
  rating: number;
  price_per_night: number;
  amenities: string[];
  location: string;
}

export interface TravelPlan {
  destination: string;
  itinerary: { [key: string]: DailyPlan };
  estimated_cost: number;
  hotel_suggestions: HotelSuggestion[];
  travel_tips: GeneralTravelTips;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const fetchTravelPlan = async (formData: {
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    preferences: string;
  }) => {
    setLoading(true);
    setError("");
    setTravelPlan(null);

    try {
      console.log("Fetching from: https://zenjourney-backend2.onrender.com/travel/plan");
      console.log("Request data:", formData);

      const auth = getAuth();
      const user = auth.currentUser;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      } else {
        console.warn("No authenticated user, skipping Authorization header");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`https://zenjourney-backend2.onrender.com/travel/plan`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
        signal: controller.signal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch failed:", { status: response.status, errorText });
        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setTravelPlan(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : `Failed to fetch travel plan: ${err.message}. Ensure backend is running.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    preferences: string;
  }) => {
    await fetchTravelPlan(formData);
  };

  const [searchParams, setSearchParams] = useState({
    destination: "",
    budget: "",
    days: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiFormData = {
      destination: searchParams.destination,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + parseInt(searchParams.days) * 86400000).toISOString().split("T")[0],
      budget:
        searchParams.budget === "budget"
          ? 1000
          : searchParams.budget === "moderate"
          ? 2500
          : 5000,
      preferences: "Based on search form",
    };
    await fetchTravelPlan(apiFormData);
  };

  const popularDestinations = [
    { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop", description: "The city of love and lights" },
    { name: "Tokyo", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop", description: "A blend of traditional and ultramodern" },
    { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop", description: "The city that never sleeps" },
    { name: "Bali", image: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1000&auto=format&fit=crop", description: "Island paradise with spiritual retreats" },
  ];

  const features = [
    {
      title: "AI-Powered Planning",
      description: "Our intelligent agents work together to create the perfect itinerary based on your preferences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Budget Optimization",
      description: "Save money without sacrificing quality. Our agents find the best deals that match your budget constraints.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Personalized Experiences",
      description: "Get recommendations tailored to your interests, preferences, and travel style.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: "Real-Time Collaboration",
      description: "Our agents work together in real-time to ensure all aspects of your trip are perfectly coordinated.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const totalPages = travelPlan ? Math.ceil(Object.keys(travelPlan.itinerary).length / itemsPerPage) : 0;
  const currentDays = travelPlan
    ? Object.entries(travelPlan.itinerary).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:py-32 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2000&auto=format&fit=crop"
              alt="Travel background"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                Plan Your <span className="text-teal-400">Epic Adventure</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed">
                Discover personalized travel plans crafted by advanced AI technology
              </p>

              <div className="mt-12">
                <form onSubmit={handleSubmitSearch} className="max-w-4xl mx-auto bg-gray-900/90 p-8 rounded-2xl shadow-2xl border border-gray-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
                        Destination
                      </label>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        placeholder= "What’s your destination?"
                        value={searchParams.destination}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                        Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={searchParams.budget}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="" className="bg-gray-800 text-white">
                          Select your budget
                        </option>
                        <option value="budget" className="bg-gray-800 text-white">
                          Budget ($)
                        </option>
                        <option value="moderate" className="bg-gray-800 text-white">
                          Moderate ($$)
                        </option>
                        <option value="luxury" className="bg-gray-800 text-white">
                          Luxury ($$$)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="days" className="block text-sm font-medium text-gray-300 mb-2">
                        Trip Duration
                      </label>
                      <input
                        type="number"
                        id="days"
                        name="days"
                        placeholder="Number of days"
                        min="1"
                        max="30"
                        value={searchParams.days}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Plan My Adventure
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Plan Results */}
        {(loading || error || travelPlan) && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-900/90 p-8 rounded-2xl shadow-xl border border-gray-800/50">
                <h2 className="text-3xl font-bold text-white mb-8">Your Travel Itinerary</h2>

                {error && (
                  <div className="p-6 mb-6 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl">
                    <p className="mb-3 font-medium">{error}</p>
                    <p className="text-sm">
                      Ensure backend agents are running. Start them with:
                      <code className="block bg-gray-800/50 p-3 mt-2 rounded-lg text-xs font-mono text-gray-300">
                        source venv/bin/activate<br />
                        python travel_planning_agent.py
                      </code>
                    </p>
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => window.location.href = "/#advanced-form"}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Try Detailed Planning
                      </button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
                  </div>
                )}

                {travelPlan && !loading && (
                  <div>
                    <div className="mb-10 text-center">
                      <h3 className="text-3xl font-bold text-white mb-3">{travelPlan.destination}</h3>
                      <p className="text-amber-400 font-medium text-xl">
                        Estimated Cost: ${travelPlan.estimated_cost.toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-8">
                      {currentDays.map(([day, plan]) => (
                        <div key={day} className="bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800/50">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-2xl font-bold text-white">{day}</h4>
                            <span className="px-4 py-2 bg-teal-900/50 text-teal-400 rounded-full text-sm font-medium">
                              {plan.weather}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                              <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <h5 className="font-semibold text-amber-400 text-lg">Main Attraction</h5>
                                </div>
                                <p className="text-gray-200 font-medium">{plan.must_visit.attraction}</p>
                                <p className="text-sm text-gray-400 mt-2">{plan.must_visit.crowd_info}</p>
                                <p className="text-sm text-gray-400 mt-1">Recommended: {plan.must_visit.recommended_time}</p>
                              </div>

                              <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  <h5 className="font-semibold text-teal-400 text-lg">Local Event</h5>
                                </div>
                                <p className="text-gray-200 font-medium">{plan.local_event.name}</p>
                                <p className="text-sm text-gray-400 mt-2">Type: {plan.local_event.type}</p>
                                <p className="text-sm text-gray-400 mt-1">Duration: {plan.local_event.duration}</p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                  </svg>
                                  <h5 className="font-semibold text-green-400 text-lg">Dining</h5>
                                </div>
                                <p className="text-gray-200 font-medium">{plan.dinner}</p>
                                <p className="text-gray-200 font-medium mt-2">Breakfast: {plan.breakfast}</p>
                              </div>

                              <div className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <h5 className="font-semibold text-red-400 text-lg">Travel Tips</h5>
                                </div>
                                <p className="text-gray-200 font-medium">Morning Activity: {plan.travel_tips.morning_activity}</p>
                                <p className="text-gray-200 font-medium mt-2">Transport: {plan.travel_tips.transport}</p>
                                <p className="text-gray-200 font-medium mt-2">Local Customs: {plan.travel_tips.local_customs}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-10 space-x-4">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 shadow-md flex items-center gap-2"
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
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium ${
                                currentPage === page
                                  ? "bg-teal-600 text-white"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              } transition-all duration-300 shadow-md`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-300 shadow-md flex items-center gap-2"
                        >
                          Next
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white">How TripSage Works</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-lg">
                Our intelligent multi-agent system crafts seamless travel experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800/50">
                  <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mb-6">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white">Popular Destinations</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-lg">
                Explore stunning locations optimized by our AI agents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-80">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                    <p className="text-gray-300 text-sm mt-2">{destination.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-800 to-teal-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore?</h2>
            <p className="text-gray-200 mb-8 text-lg leading-relaxed">
              Let our AI agents design your dream vacation with unparalleled precision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about" className="px-8 py-4 bg-white text-teal-800 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg">
                Learn More
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-teal-700/50 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section id="advanced-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white">Detailed Travel Planning</h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-lg">
                Create a comprehensive travel plan with tailored daily activities
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <TravelForm onSubmit={handleSubmit} loading={loading} />
              <TravelPlanDisplay travelPlan={travelPlan} loading={loading} error={error} />
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}