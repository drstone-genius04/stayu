import React, { useState, useEffect } from 'react';
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
    priceRange: [0, 500],
    amenities: [],
    maxDistanceKm: undefined,
    targetLocation: { lat: 38.9907, lng: -76.9361 } // Default to College Park
  });

  // Pre-fill today's date for easier testing
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const endTime = `${String(now.getHours() + 1).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setFilters(prev => ({
      ...prev,
      date: today,
      checkIn: currentTime,
      checkOut: endTime
    }));
  }, []);

  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // Get user's current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prev => ({
            ...prev,
            targetLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 -mt-8 relative z-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Check-in Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={filters.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Check-out Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={filters.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              className="input-field"
              required
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
        </div>

        {/* Advanced Options */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
          >
            <svg
              className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced Search Options
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0] || ''}
                    onChange={(e) => handleInputChange('priceRange', [
                      parseFloat(e.target.value) || 0,
                      filters.priceRange[1]
                    ])}
                    className="input-field flex-1"
                    min="0"
                  />
                  <span className="self-center text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1] || ''}
                    onChange={(e) => handleInputChange('priceRange', [
                      filters.priceRange[0],
                      parseFloat(e.target.value) || 1000
                    ])}
                    className="input-field flex-1"
                    min="0"
                  />
                </div>
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Distance (km)
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxDistanceKm || ''}
                  onChange={(e) => handleInputChange('maxDistanceKm', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="input-field"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Location
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="btn-secondary text-sm px-3 py-2 whitespace-nowrap"
                    title="Use current location"
                  >
                    📍 Current
                  </button>
                  <div className="flex-1 grid grid-cols-2 gap-1">
                    <input
                      type="number"
                      placeholder="Lat"
                      value={filters.targetLocation?.lat || ''}
                      onChange={(e) => handleInputChange('targetLocation', {
                        lat: parseFloat(e.target.value) || 0,
                        lng: filters.targetLocation?.lng || 0
                      })}
                      className="input-field text-sm"
                      step="0.0001"
                    />
                    <input
                      type="number"
                      placeholder="Lng"
                      value={filters.targetLocation?.lng || ''}
                      onChange={(e) => handleInputChange('targetLocation', {
                        lat: filters.targetLocation?.lat || 0,
                        lng: parseFloat(e.target.value) || 0
                      })}
                      className="input-field text-sm"
                      step="0.0001"
                    />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-end">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="text-xs text-primary-700">
                    <strong>Intelligent Matching:</strong> Always active. Finds the best time slots matching your preferences.
                  </p>
                </div>
              </div>
            </div>
          )}
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
