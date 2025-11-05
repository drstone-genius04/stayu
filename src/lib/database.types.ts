/**
 * Database type definitions for Supabase
 * These types should match your Supabase database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          description: string;
          images: string[];
          amenities: string[];
          rating: number;
          review_count: number;
          price_per_hour: number;
          coordinates: {
            lat: number;
            lng: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          description: string;
          images: string[];
          amenities: string[];
          rating?: number;
          review_count?: number;
          price_per_hour: number;
          coordinates: {
            lat: number;
            lng: number;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          description?: string;
          images?: string[];
          amenities?: string[];
          rating?: number;
          review_count?: number;
          price_per_hour?: number;
          coordinates?: {
            lat: number;
            lng: number;
          };
          updated_at?: string;
        };
      };
      time_slots: {
        Row: {
          id: string;
          hotel_id: string;
          start_time: string;
          end_time: string;
          available: boolean;
          price: number;
          date?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hotel_id: string;
          start_time: string;
          end_time: string;
          available?: boolean;
          price: number;
          date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hotel_id?: string;
          start_time?: string;
          end_time?: string;
          available?: boolean;
          price?: number;
          date?: string | null;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          hotel_id: string;
          time_slot_id: string;
          user_id?: string | null;
          guest_name: string;
          guest_email: string;
          guest_phone?: string | null;
          guests: number;
          total_price: number;
          booking_date: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hotel_id: string;
          time_slot_id: string;
          user_id?: string | null;
          guest_name: string;
          guest_email: string;
          guest_phone?: string | null;
          guests: number;
          total_price: number;
          booking_date: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hotel_id?: string;
          time_slot_id?: string;
          user_id?: string | null;
          guest_name?: string;
          guest_email?: string;
          guest_phone?: string | null;
          guests?: number;
          total_price?: number;
          booking_date?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
  };
}

