import { Hotel } from '../types';

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
      '/images/hotel-exterior.jpg',
      '/images/hotel-room.jpg',
      '/images/hotel-lobby.jpg'
    ],
    amenities: ['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge', 'Shuttle Service'],
    rating: 4.6,
    reviewCount: 342,
    pricePerHour: 55,
    availableTimeSlots: [
      { id: '1', startTime: '08:00', endTime: '11:00', available: true, price: 165 },
      { id: '2', startTime: '11:00', endTime: '14:00', available: true, price: 165 },
      { id: '3', startTime: '14:00', endTime: '17:00', available: true, price: 165 },
      { id: '4', startTime: '17:00', endTime: '20:00', available: false, price: 165 },
      { id: '5', startTime: '20:00', endTime: '23:00', available: true, price: 165 },
      { id: '6', startTime: '23:00', endTime: '02:00', available: true, price: 165 }
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
      '/images/hotel2-exterior.jpg',
      '/images/hotel2-room.jpg',
      '/images/hotel2-lobby.jpg'
    ],
    amenities: ['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge'],
    rating: 4.4,
    reviewCount: 278,
    pricePerHour: 48,
    availableTimeSlots: [
      { id: '1', startTime: '09:00', endTime: '12:00', available: true, price: 144 },
      { id: '2', startTime: '12:00', endTime: '15:00', available: true, price: 144 },
      { id: '3', startTime: '15:00', endTime: '18:00', available: true, price: 144 },
      { id: '4', startTime: '18:00', endTime: '21:00', available: true, price: 144 },
      { id: '5', startTime: '21:00', endTime: '24:00', available: false, price: 144 }
    ],
    coordinates: { lat: 38.9920, lng: -76.9340 }
  }
];
