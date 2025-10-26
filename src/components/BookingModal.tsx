import React, { useState } from 'react';
import { Hotel, TimeSlot } from '../types';

interface BookingModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: { hotel: Hotel; timeSlot: TimeSlot; guests: number }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, isOpen, onClose, onConfirm }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [guests, setGuests] = useState(1);

  if (!isOpen || !hotel) return null;

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      onConfirm({ hotel, timeSlot: selectedTimeSlot, guests });
      onClose();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.availableTimeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={!slot.available}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTimeSlot?.id === slot.id
                      ? 'border-primary-500 bg-primary-50'
                      : slot.available
                      ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${slot.price} total
                    </div>
                    {!slot.available && (
                      <div className="text-xs text-red-600 mt-1">Unavailable</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Selection */}
          <div className="mb-6">
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
              disabled={!selectedTimeSlot}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

