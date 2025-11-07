import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Hotel } from '../types';
import { marylandHotels } from '../data/hotels';

interface MapPageProps {
  onBookHotel: (hotel: Hotel) => void;
  userLocation?: { lat: number; lng: number };
}

const MapPage: React.FC<MapPageProps> = ({ onBookHotel, userLocation }) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: userLocation || { lat: 38.9907, lng: -76.9361 }, // College Park, MD
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    const googleMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(googleMap);

    // Create markers for hotels
    const hotelMarkers = marylandHotels.map(hotel => {
      const marker = new google.maps.Marker({
        position: hotel.coordinates,
        map: googleMap,
        title: hotel.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="white" stroke-width="3"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">$</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        setSelectedHotel(hotel);
        googleMap.panTo(hotel.coordinates);
      });

      return marker;
    });

    setMarkers(hotelMarkers);

    // Add user location marker if available
    if (userLocation) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: googleMap,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="#ef4444" stroke="white" stroke-width="3"/>
              <circle cx="15" cy="15" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });
    }

    return () => {
      hotelMarkers.forEach(marker => marker.setMap(null));
    };
  }, [userLocation]);

  const handleBookHotel = (hotel: Hotel) => {
    onBookHotel(hotel);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nearby Hotels</h1>
              <p className="text-sm text-gray-600">Find and book hotels near you</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Your Location</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Hotels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Hotel Details Sidebar */}
        {selectedHotel && (
          <div className="w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h3>
                  <p className="text-sm text-gray-600">{selectedHotel.address}</p>
                </div>
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.floor(selectedHotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {selectedHotel.rating} ({selectedHotel.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  ${selectedHotel.pricePerHour}
                </span>
                <span className="text-gray-600">/hour</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">{selectedHotel.description}</p>

              {/* Amenities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedHotel.amenities.slice(0, 6).map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Time Slots */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Today</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHotel.availableTimeSlots
                    .filter(slot => slot.available)
                    .slice(0, 6)
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded text-center"
                      >
                        <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                        <div className="text-green-600">${slot.price.toFixed(0)}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBookHotel(selectedHotel)}
                className="w-full btn-primary"
              >
                View Details & Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Google Maps wrapper component
const MapWrapper: React.FC<MapPageProps> = (props) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Map Unavailable</h2>
          <p className="text-gray-600">
            Google Maps API key is not configured. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file.
          </p>
        </div>
      </div>
    );
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading map...</div>;
      case Status.FAILURE:
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Failed to load map</div>;
      case Status.SUCCESS:
        return <MapPage {...props} />;
    }
  };

  return (
    <Wrapper apiKey={apiKey} render={render} />
  );
};

export default MapWrapper;
