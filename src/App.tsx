import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchForm from './components/SearchForm';
import HotelList from './components/HotelList';
import BookingModal from './components/BookingModal';
import ContactUs from './components/ContactUs';
import Login from './components/Login';
import MapPage from './components/MapPage';
import { Hotel, SearchFilters, MatchedHotel } from './types';
import { marylandHotels } from './data/hotels';
import { matchUserWithHotels, convertFiltersToPreferences } from './services/matchingService';

// Main App Component
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // For MVP, accept any login
    setUser({ email });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSwitchToSignup={() => {/* For MVP, just show login */}}
                />
              )
            }
          />
          <Route
            path="/map"
            element={
              isAuthenticated ? (
                <MapPage onBookHotel={(hotel) => {
                  // Navigate to main page with selected hotel
                  window.location.href = '/?hotel=' + encodeURIComponent(hotel.id);
                }} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Home Page Component
const HomePage: React.FC<{
  isAuthenticated: boolean;
  user: { email: string } | null;
  onLogout: () => void;
}> = ({ isAuthenticated, user, onLogout }) => {
  const [hotels] = useState<Hotel[]>(marylandHotels);
  const [filteredHotels, setFilteredHotels] = useState<MatchedHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  // Filter hotels based on search criteria with optional smart matching
  const filterHotels = async (filters: SearchFilters, skipDelay = false) => {
    if (!skipDelay) {
      setLoading(true);
    }
    
    setCurrentFilters(filters);

    const performFilter = async () => {
      try {
        let results: MatchedHotel[] = [];

        // Always use intelligent matching algorithm when date/time are provided
        if (filters.date && filters.checkIn && filters.checkOut) {
          const userPrefs = convertFiltersToPreferences({
            date: filters.date,
            checkIn: filters.checkIn,
            checkOut: filters.checkOut,
            budgetMin: filters.priceRange[0],
            budgetMax: filters.priceRange[1],
            maxDistanceKm: filters.maxDistanceKm,
            targetLocation: filters.targetLocation,
          });

          if (userPrefs) {
            // Use intelligent matching algorithm
            const matchedResults = matchUserWithHotels(userPrefs, hotels);
            
            // Convert matched results to MatchedHotel format
            const mappedResults = matchedResults.map((match) => {
              // Apply amenities filter
              if (filters.amenities.length > 0) {
                const hasRequiredAmenities = filters.amenities.every(amenity =>
                  match.hotel.amenities.includes(amenity)
                );
                if (!hasRequiredAmenities) return null;
              }

              const matchedHotel: MatchedHotel = {
                ...match.hotel,
                matchedSlot: match.matchedSlot,
                distanceKm: match.distanceKm,
                timeShiftMinutes: match.timeShiftMinutes,
                matchScore: match.matchScore,
              };

              return matchedHotel;
            });

            results = mappedResults.filter((hotel): hotel is MatchedHotel => hotel !== null);
          } else {
            // Fallback to traditional filtering if conversion fails
            results = performTraditionalFilter(hotels, filters);
          }
        } else {
          // Traditional filtering when no date/time provided
          results = performTraditionalFilter(hotels, filters);
        }

        setFilteredHotels(results);
      } catch (err) {
        console.error('Error filtering hotels:', err);
        setError('Error filtering hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (skipDelay) {
      await performFilter();
    } else {
      // Simulate API call delay
      setTimeout(performFilter, 500);
    }
  };

  // Traditional filtering method (fallback)
  const performTraditionalFilter = (hotelList: Hotel[], filters: SearchFilters): MatchedHotel[] => {
    return hotelList
      .filter(hotel => {
        // Amenities filter
        if (filters.amenities.length > 0) {
          const hasRequiredAmenities = filters.amenities.every(amenity =>
            hotel.amenities.includes(amenity)
          );
          if (!hasRequiredAmenities) return false;
        }

        // Price range filter (check hourly rate)
        if (hotel.pricePerHour < filters.priceRange[0] || hotel.pricePerHour > filters.priceRange[1]) {
          return false;
        }

        return true;
      })
      .map(hotel => ({
        ...hotel,
        matchedSlot: undefined,
        distanceKm: filters.targetLocation
          ? calculateDistance(hotel.coordinates, filters.targetLocation)
          : undefined,
      }));
  };

  // Simple distance calculation helper
  const calculateDistance = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Handle hotel booking
  const handleBookHotel = (hotel: MatchedHotel) => {
    // If there's a matched slot, use it; otherwise use the hotel as-is
    const hotelToBook: Hotel = hotel.matchedSlot
      ? {
          ...hotel,
          availableTimeSlots: hotel.availableTimeSlots.map(slot => 
            slot.id === hotel.matchedSlot!.originalSlotId
              ? { ...slot, startTime: hotel.matchedSlot!.startTime, endTime: hotel.matchedSlot!.endTime }
              : slot
          )
        }
      : hotel;
    
    setSelectedHotel(hotelToBook);
    setIsBookingModalOpen(true);
  };

  // Handle booking confirmation (called after successful backend save)
  const handleConfirmBooking = (booking: { hotel: Hotel; timeSlot: any; guests: number }) => {
    // Show success message
    alert(`Booking confirmed for ${booking.hotel.name} from ${booking.timeSlot.startTime} to ${booking.timeSlot.endTime} for ${booking.guests} guest(s). Total: $${booking.timeSlot.price}`);

    setIsBookingModalOpen(false);
    setSelectedHotel(null);
  };

  // Close booking modal
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHotel(null);
  };

  // Filter hotels when hotels data changes (initial load)
  useEffect(() => {
    if (hotels.length > 0) {
      const initialFilters: SearchFilters = {
        date: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        priceRange: [0, 500],
        amenities: [],
        targetLocation: { lat: 38.9907, lng: -76.9361 }
      };
      filterHotels(initialFilters, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />
      
      <main>
        <Hero />
        
        {/* Search Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchForm onSearch={filterHotels} />
          </div>
        </section>

                 {/* Results Section */}
                 <section id="hotels" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Available Hotels in College Park
              </h2>
              <p className="text-gray-600">
                Premium accommodations near University of Maryland • Book by the hour with no minimum stay
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <HotelList
              hotels={filteredHotels}
              onBook={handleBookHotel}
              loading={loading}
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About StayU
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Book hotels anytime, anywhere. We're revolutionizing short-stay accommodations 
                for researchers, business travelers, and anyone who needs flexible hotel access.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Use Cases */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why StayU?</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Flexible Timing</h4>
                      <p className="text-gray-600">Book for as little as 3 hours or as long as you need. Perfect for research meetings, layovers, or quick getaways.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h4>
                      <p className="text-gray-600">All hotels are carefully selected for their quality, amenities, and service standards.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Booking</h4>
                      <p className="text-gray-600">Book and confirm your stay instantly. No waiting for approval or confirmation calls.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founders */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet the Founders</h3>
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <span className="text-primary-600 font-bold text-lg">A</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Allan</h4>
                        <p className="text-primary-600 font-medium">Co-Founder & CTO</p>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Allan is a researcher with extensive experience in technology and innovation. 
                      Previously worked as a founding developer at a startup, bringing deep technical expertise and entrepreneurial experience to StayU.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <span className="text-primary-600 font-bold text-lg">T</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Theo</h4>
                        <p className="text-primary-600 font-medium">Co-Founder & CFO</p>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Theo served in the Army, flying drones for NASA missions. His aerospace background and technical expertise in cutting-edge technology 
                      brings unique perspective to solving complex problems in the hospitality and travel industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-primary-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                To make hotel accommodations more accessible and flexible for everyone. Whether you're a researcher needing a quiet space for a few hours, 
                a business traveler with a long layover, or someone who just wants to rest during a busy day, StayU provides the perfect solution.
              </p>
            </div>
          </div>
        </section>

                 {/* Contact Section */}
                 <div id="contact">
                   <ContactUs />
                 </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary-400 mb-4">StayU</h3>
              <p className="text-gray-400">
                Book premium hotels by the hour for business meetings, layovers, and quick getaways.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">About Us</button></li>
                <li><button className="hover:text-white transition-colors text-left">Careers</button></li>
                <li><button className="hover:text-white transition-colors text-left">Press</button></li>
                <li><button className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Help Center</button></li>
                <li><button className="hover:text-white transition-colors text-left">Safety</button></li>
                <li><button className="hover:text-white transition-colors text-left">Cancellation</button></li>
                <li><button className="hover:text-white transition-colors text-left">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors text-left">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors text-left">Cookie Policy</button></li>
                <li><button className="hover:text-white transition-colors text-left">Accessibility</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StayU. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        hotel={selectedHotel}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default App;
