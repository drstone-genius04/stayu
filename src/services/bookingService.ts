import { supabase } from '../lib/supabase';
import { Hotel, TimeSlot } from '../types';
import { Database } from '../lib/database.types';

/**
 * Booking Service
 * Handles all booking-related database operations
 */

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
type TimeSlotRow = Database['public']['Tables']['time_slots']['Row'];
type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update'];

export interface CreateBookingInput {
  hotel: Hotel;
  timeSlot: TimeSlot;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  bookingDate: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  timeSlotId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guests: number;
  totalPrice: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

/**
 * Creates a new booking
 */
export const createBooking = async (
  input: CreateBookingInput
): Promise<Booking> => {
  try {
    // First, verify the time slot is still available
    const { data: timeSlot, error: slotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', input.timeSlot.id)
      .eq('available', true)
      .single()
      .returns<TimeSlotRow>();

    if (slotError || !timeSlot) {
      throw new Error('Time slot is no longer available');
    }

    // Create the booking
    const bookingData: BookingInsert = {
      hotel_id: input.hotel.id,
      time_slot_id: input.timeSlot.id,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      guest_phone: input.guestPhone || null,
      guests: input.guests,
      total_price: input.timeSlot.price,
      booking_date: input.bookingDate,
      status: 'confirmed', // Auto-confirm for MVP
    };

    const { data: booking, error: bookingError } = await (supabase as any)
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      throw bookingError || new Error('Failed to create booking');
    }

    const typedBooking = booking as BookingRow;

    // Update time slot availability
    const slotUpdate: TimeSlotUpdate = { available: false };
    const { error: updateError } = await (supabase as any)
      .from('time_slots')
      .update(slotUpdate)
      .eq('id', input.timeSlot.id);

    if (updateError) {
      console.error('Error updating time slot availability:', updateError);
      // Don't throw here - booking is already created
      // In production, you'd want to handle this with a transaction
    }

    return {
      id: typedBooking.id,
      hotelId: typedBooking.hotel_id,
      timeSlotId: typedBooking.time_slot_id,
      guestName: typedBooking.guest_name,
      guestEmail: typedBooking.guest_email,
      guestPhone: typedBooking.guest_phone || undefined,
      guests: typedBooking.guests,
      totalPrice: typedBooking.total_price,
      bookingDate: typedBooking.booking_date,
      status: typedBooking.status,
      createdAt: typedBooking.created_at,
    };
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

/**
 * Fetches bookings by email
 */
export const fetchBookingsByEmail = async (email: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('guest_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return (data || []).map((booking) => {
      const typedBooking = booking as BookingRow;
      return {
        id: typedBooking.id,
        hotelId: typedBooking.hotel_id,
        timeSlotId: typedBooking.time_slot_id,
        guestName: typedBooking.guest_name,
        guestEmail: typedBooking.guest_email,
        guestPhone: typedBooking.guest_phone || undefined,
        guests: typedBooking.guests,
        totalPrice: typedBooking.total_price,
        bookingDate: typedBooking.booking_date,
        status: typedBooking.status,
        createdAt: typedBooking.created_at,
      };
    });
  } catch (error) {
    console.error('Error in fetchBookingsByEmail:', error);
    throw error;
  }
};

/**
 * Cancels a booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    // Get the booking to find the time slot
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('time_slot_id')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error('Booking not found');
    }

    const typedBooking = booking as Pick<BookingRow, 'time_slot_id'>;

    // Update booking status
    const bookingUpdate: BookingUpdate = { status: 'cancelled' };
    const { error: updateError } = await (supabase as any)
      .from('bookings')
      .update(bookingUpdate)
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      throw updateError;
    }

    // Make the time slot available again
    const slotUpdate: TimeSlotUpdate = { available: true };
    const { error: slotError } = await (supabase as any)
      .from('time_slots')
      .update(slotUpdate)
      .eq('id', typedBooking.time_slot_id);

    if (slotError) {
      console.error('Error updating time slot:', slotError);
      // Don't throw - booking is already cancelled
    }
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    throw error;
  }
};

