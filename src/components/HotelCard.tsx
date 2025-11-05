import React from 'react';
import { MatchedHotel } from '../types';

interface HotelCardProps {
  hotel: MatchedHotel;
  onBook: (hotel: MatchedHotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Hotel Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex flex-col gap-1">
          {hotel.matchedSlot ? (
            <>
              <span className="text-sm font-bold text-primary-700">
                ${hotel.matchedSlot.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-600">
                ${hotel.pricePerHour}/hour
              </span>
              <div className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                ⭐ BEST
              </div>
            </>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              ${hotel.pricePerHour}/hour
            </span>
          )}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
          <div className="flex items-center">
            {renderStars(hotel.rating)}
            <span className="ml-1 text-sm text-gray-600">({hotel.reviewCount})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">{hotel.address}, {hotel.city}, {hotel.state}</p>
        
        {/* Best Match - Prominent CTA */}
        {hotel.matchedSlot && (
          <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ⭐ BEST MATCH
                </div>
                <div className="text-sm font-semibold text-primary-800">
                  {hotel.matchedSlot.startTime} - {hotel.matchedSlot.endTime}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-700">
                  ${hotel.matchedSlot.price.toFixed(2)}
                </div>
                {hotel.timeShiftMinutes !== undefined && hotel.timeShiftMinutes > 0 && (
                  <div className="text-xs text-primary-600">
                    {hotel.timeShiftMinutes} min shift
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {hotel.distanceKm !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span className="text-lg">📍</span>
                  <span>{hotel.distanceKm.toFixed(1)} km away</span>
                </div>
              )}

              <button
                onClick={() => onBook(hotel)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
        
        {hotel.distanceKm !== undefined && !hotel.matchedSlot && (
          <div className="mb-2 text-xs text-gray-600">
            📍 {hotel.distanceKm.toFixed(1)} km away
          </div>
        )}
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{hotel.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Available Time Slots */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Available Today:</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.availableTimeSlots.slice(0, 3).map((slot) => (
              <span
                key={slot.id}
                className={`text-xs px-2 py-1 rounded ${
                  slot.available
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {slot.startTime} - {slot.endTime} (${slot.price.toFixed(0)})
              </span>
            ))}
          </div>
        </div>

        {/* Book Button - Less prominent when Best Match exists */}
        <button
          onClick={() => onBook(hotel)}
          className={`${hotel.matchedSlot
            ? 'btn-secondary w-full opacity-75 hover:opacity-100'
            : 'btn-primary w-full'
          }`}
        >
          {hotel.matchedSlot ? 'View Other Times' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default HotelCard;

