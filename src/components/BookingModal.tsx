import React, { useState } from 'react';
import { Hotel, TimeSlot } from '../types';
// import { createBooking } from '../services/bookingService'; // Disabled for MVP

interface BookingModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: { hotel: Hotel; timeSlot: TimeSlot; guests: number }) => void;
}

/**
 * Calculates the duration in hours between two time strings (HH:MM format)
 * Handles cases where endTime is on the next day (e.g., 23:00 to 02:00)
 */
const calculateHours = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  // Handle next-day end times (e.g., 23:00 to 02:00)
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours
  }
  
  const durationMinutes = endMinutes - startMinutes;
  return durationMinutes / 60;
};

/**
 * Checks if a time slot meets the minimum duration requirement (3 hours)
 */
const isValidDuration = (timeSlot: TimeSlot): boolean => {
  const hours = calculateHours(timeSlot.startTime, timeSlot.endTime);
  return hours >= 3;
};

const BookingModal: React.FC<BookingModalProps> = ({ hotel, isOpen, onClose, onConfirm }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !hotel) return null;

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!isValidDuration(slot)) {
      setError('Minimum booking duration is 3 hours. Please select a longer time slot.');
      setSelectedTimeSlot(null);
      return;
    }
    setError('');
    setSelectedTimeSlot(slot);
  };

  const handleConfirm = async () => {
    if (!selectedTimeSlot) {
      setError('Please select a time slot.');
      return;
    }

    if (!isValidDuration(selectedTimeSlot)) {
      setError('Minimum booking duration is 3 hours. Please select a longer time slot.');
      return;
    }

    if (!guestName.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!guestEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // For MVP: Simulate booking delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the original onConfirm for UI updates
      onConfirm({ hotel, timeSlot: selectedTimeSlot, guests });

      // Reset form
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setSelectedTimeSlot(null);
      setGuests(1);

      onClose();
    } catch (err: any) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book {hotel.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Hotel Info */}
          <div className="flex gap-4 mb-6">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
              <p className="text-gray-600 text-sm">{hotel.address}, {hotel.city}</p>
              <p className="text-primary-600 font-semibold">${hotel.pricePerHour}/hour</p>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Slot</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.availableTimeSlots.map((slot) => {
                const isTooShort = !isValidDuration(slot);
                const isDisabled = !slot.available || isTooShort;
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTimeSlot?.id === slot.id
                        ? 'border-primary-500 bg-primary-50'
                        : isDisabled
                        ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${slot.price} total ({calculateHours(slot.startTime, slot.endTime).toFixed(1)} hours)
                      </div>
                      {!slot.available && (
                        <div className="text-xs text-red-600 mt-1">Unavailable</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="input-field"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="input-field max-w-xs"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedTimeSlot && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Hotel:</span>
                  <span>{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${selectedTimeSlot.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTimeSlot || isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

