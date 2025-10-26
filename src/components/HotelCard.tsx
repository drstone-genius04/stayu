import React from 'react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
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
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-sm font-semibold text-gray-900">
            ${hotel.pricePerHour}/hour
          </span>
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

        <p className="text-gray-600 text-sm mb-3">{hotel.address}, {hotel.city}, {hotel.state}</p>
        
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
                {slot.startTime} - {slot.endTime}
              </span>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook(hotel)}
          className="btn-primary w-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default HotelCard;

