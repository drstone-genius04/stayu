import React, { useState } from 'react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    date: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 100],
    amenities: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 -mt-8 relative z-10">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Check-in Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Time
          </label>
          <input
            type="time"
            value={filters.checkIn}
            onChange={(e) => handleInputChange('checkIn', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Check-out Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Time
          </label>
          <input
            type="time"
            value={filters.checkOut}
            onChange={(e) => handleInputChange('checkOut', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <select
            value={filters.guests}
            onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
            className="input-field"
          >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests</option>
            <option value={5}>5+ Guests</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary w-full py-3 text-lg"
          >
            Search Hotels
          </button>
        </div>
      </form>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick filters:</span>
          {['WiFi', 'Parking', 'Pool', 'Restaurant', 'Business Center'].map((amenity) => (
            <button
              key={amenity}
              onClick={() => {
                const newAmenities = filters.amenities.includes(amenity)
                  ? filters.amenities.filter(a => a !== amenity)
                  : [...filters.amenities, amenity];
                handleInputChange('amenities', newAmenities);
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.amenities.includes(amenity)
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
