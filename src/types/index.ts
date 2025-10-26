export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  availableTimeSlots: TimeSlot[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

export interface BookingRequest {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface SearchFilters {
  date: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  amenities: string[];
}
