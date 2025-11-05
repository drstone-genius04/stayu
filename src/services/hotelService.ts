import { supabase } from '../lib/supabase';
import { Hotel, TimeSlot } from '../types';
import { Database } from '../lib/database.types';

/**
 * Hotel Service
 * Handles all hotel-related database operations
 */

type HotelRow = Database['public']['Tables']['hotels']['Row'];
type TimeSlotRow = Database['public']['Tables']['time_slots']['Row'];

/**
 * Fetches all hotels from the database
 */
export const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }

    // Transform database rows to Hotel type
    const hotels: Hotel[] = await Promise.all(
      (data || []).map(async (hotel) => {
        const typedHotel = hotel as HotelRow;

        // Fetch time slots for this hotel
        const { data: timeSlots } = await supabase
          .from('time_slots')
          .select('*')
          .eq('hotel_id', typedHotel.id)
          .order('start_time');

        const availableTimeSlots: TimeSlot[] = (timeSlots || []).map((slot) => {
          const typedSlot = slot as TimeSlotRow;
          return {
            id: typedSlot.id,
            startTime: typedSlot.start_time,
            endTime: typedSlot.end_time,
            available: typedSlot.available,
            price: typedSlot.price,
          };
        });

        return {
          id: typedHotel.id,
          name: typedHotel.name,
          address: typedHotel.address,
          city: typedHotel.city,
          state: typedHotel.state,
          zipCode: typedHotel.zip_code,
          description: typedHotel.description,
          images: typedHotel.images,
          amenities: typedHotel.amenities,
          rating: typedHotel.rating || 0,
          reviewCount: typedHotel.review_count || 0,
          pricePerHour: typedHotel.price_per_hour,
          availableTimeSlots,
          coordinates: typedHotel.coordinates,
        };
      })
    );

    return hotels;
  } catch (error) {
    console.error('Error in fetchHotels:', error);
    throw error;
  }
};

/**
 * Fetches a single hotel by ID
 */
export const fetchHotelById = async (hotelId: string): Promise<Hotel | null> => {
  try {
    const { data: hotel, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();

    if (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }

    if (!hotel) return null;

    const typedHotel = hotel as HotelRow;

    // Fetch time slots for this hotel
    const { data: timeSlots } = await supabase
      .from('time_slots')
      .select('*')
      .eq('hotel_id', typedHotel.id)
      .order('start_time');

    const availableTimeSlots: TimeSlot[] = (timeSlots || []).map((slot) => {
      const typedSlot = slot as TimeSlotRow;
      return {
        id: typedSlot.id,
        startTime: typedSlot.start_time,
        endTime: typedSlot.end_time,
        available: typedSlot.available,
        price: typedSlot.price,
      };
    });

    return {
      id: typedHotel.id,
      name: typedHotel.name,
      address: typedHotel.address,
      city: typedHotel.city,
      state: typedHotel.state,
      zipCode: typedHotel.zip_code,
      description: typedHotel.description,
      images: typedHotel.images,
      amenities: typedHotel.amenities,
      rating: typedHotel.rating || 0,
      reviewCount: typedHotel.review_count || 0,
      pricePerHour: typedHotel.price_per_hour,
      availableTimeSlots,
      coordinates: typedHotel.coordinates,
    };
  } catch (error) {
    console.error('Error in fetchHotelById:', error);
    throw error;
  }
};

/**
 * Updates hotel availability (for admin use)
 */
export const updateHotelAvailability = async (
  hotelId: string,
  availability: boolean
): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('hotels')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', hotelId);

    if (error) {
      console.error('Error updating hotel availability:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateHotelAvailability:', error);
    throw error;
  }
};

