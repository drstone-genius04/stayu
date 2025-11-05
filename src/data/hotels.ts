import { Hotel } from '../types';

const baseUrl = process.env.PUBLIC_URL || '';

export const marylandHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hotel College Park',
    address: '8400 Baltimore Avenue',
    city: 'College Park',
    state: 'MD',
    zipCode: '20740',
    description: 'Modern business hotel conveniently located near the University of Maryland. Perfect for researchers, academics, and business travelers visiting the College Park area. Features state-of-the-art meeting facilities and comfortable accommodations.',
    images: [
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.56.49 AM.png`,
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.57.09 AM.png`,
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.56.49 AM.png`
    ],
    amenities: ['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge', 'Shuttle Service'],
    rating: 4.6,
    reviewCount: 342,
    pricePerHour: 55, // Base hourly rate - actual prices vary by time slot
    availableTimeSlots: [
      { id: '1', startTime: '08:00', endTime: '11:00', available: true, price: 110 }, // Early morning - cheaper
      { id: '2', startTime: '11:00', endTime: '14:00', available: true, price: 220 }, // Lunch rush - expensive
      { id: '3', startTime: '14:00', endTime: '17:00', available: true, price: 165 }, // Afternoon - moderate
      { id: '4', startTime: '17:00', endTime: '20:00', available: false, price: 275 }, // Evening peak - most expensive
      { id: '5', startTime: '20:00', endTime: '23:00', available: true, price: 110 }, // Late evening - cheaper
      { id: '6', startTime: '23:00', endTime: '02:00', available: true, price: 82.5 } // Overnight - cheapest
    ],
    coordinates: { lat: 38.9907, lng: -76.9361 }
  },
  {
    id: '2',
    name: 'College Park Inn',
    address: '9200 Baltimore Avenue',
    city: 'College Park',
    state: 'MD',
    zipCode: '20740',
    description: 'Contemporary hotel offering comfortable accommodations with easy access to University of Maryland campus. Ideal for academic conferences, research meetings, and business travelers.',
    images: [
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.57.09 AM.png`,
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.56.49 AM.png`,
      `${baseUrl}/images/Screenshot 2025-10-26 at 1.57.09 AM.png`
    ],
    amenities: ['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge'],
    rating: 4.4,
    reviewCount: 278,
    pricePerHour: 48, // Base hourly rate - actual prices vary by time slot
    availableTimeSlots: [
      { id: '1', startTime: '09:00', endTime: '12:00', available: true, price: 96 }, // Early morning - cheaper
      { id: '2', startTime: '12:00', endTime: '15:00', available: true, price: 192 }, // Lunch rush - expensive
      { id: '3', startTime: '15:00', endTime: '18:00', available: true, price: 144 }, // Afternoon - moderate
      { id: '4', startTime: '18:00', endTime: '21:00', available: true, price: 240 }, // Evening peak - most expensive
      { id: '5', startTime: '21:00', endTime: '24:00', available: false, price: 96 } // Late night - cheaper
    ],
    coordinates: { lat: 38.9920, lng: -76.9340 }
  }
];
