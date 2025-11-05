-- StayU Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  start_time VARCHAR(5) NOT NULL, -- Format: HH:MM
  end_time VARCHAR(5) NOT NULL, -- Format: HH:MM
  available BOOLEAN DEFAULT true,
  price DECIMAL(10, 2) NOT NULL,
  date DATE, -- Optional: for date-specific slots
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  user_id UUID, -- For future user authentication
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20),
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_time_slots_hotel_id ON time_slots(hotel_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(available);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to hotels and time slots
CREATE POLICY "Allow public read access to hotels" ON hotels
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to time slots" ON time_slots
    FOR SELECT USING (true);

-- Policy: Allow public to create bookings
CREATE POLICY "Allow public to create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Policy: Allow users to read their own bookings
CREATE POLICY "Allow users to read own bookings" ON bookings
    FOR SELECT USING (true); -- For MVP, allow all reads. In production, restrict by user_id or email

-- Insert sample data (optional - for testing)
-- You can run this after creating the tables
INSERT INTO hotels (id, name, address, city, state, zip_code, description, images, amenities, rating, review_count, price_per_hour, coordinates) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Hotel College Park',
  '8400 Baltimore Avenue',
  'College Park',
  'MD',
  '20740',
  'Modern business hotel conveniently located near the University of Maryland. Perfect for researchers, academics, and business travelers visiting the College Park area. Features state-of-the-art meeting facilities and comfortable accommodations.',
  ARRAY['/images/Screenshot 2025-10-26 at 1.56.49 AM.png', '/images/Screenshot 2025-10-26 at 1.57.09 AM.png'],
  ARRAY['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge', 'Shuttle Service'],
  4.6,
  342,
  55.00,
  '{"lat": 38.9907, "lng": -76.9361}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'College Park Inn',
  '9200 Baltimore Avenue',
  'College Park',
  'MD',
  '20740',
  'Contemporary hotel offering comfortable accommodations with easy access to University of Maryland campus. Ideal for academic conferences, research meetings, and business travelers.',
  ARRAY['/images/Screenshot 2025-10-26 at 1.57.09 AM.png', '/images/Screenshot 2025-10-26 at 1.56.49 AM.png'],
  ARRAY['WiFi', 'Parking', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Room Service', 'Concierge'],
  4.4,
  278,
  48.00,
  '{"lat": 38.9920, "lng": -76.9340}'::jsonb
);

-- Insert time slots for Hotel College Park
INSERT INTO time_slots (hotel_id, start_time, end_time, available, price) VALUES
('550e8400-e29b-41d4-a716-446655440000', '08:00', '11:00', true, 165.00),
('550e8400-e29b-41d4-a716-446655440000', '11:00', '14:00', true, 165.00),
('550e8400-e29b-41d4-a716-446655440000', '14:00', '17:00', true, 165.00),
('550e8400-e29b-41d4-a716-446655440000', '17:00', '20:00', false, 165.00),
('550e8400-e29b-41d4-a716-446655440000', '20:00', '23:00', true, 165.00),
('550e8400-e29b-41d4-a716-446655440000', '23:00', '02:00', true, 165.00);

-- Insert time slots for College Park Inn
INSERT INTO time_slots (hotel_id, start_time, end_time, available, price) VALUES
('550e8400-e29b-41d4-a716-446655440001', '09:00', '12:00', true, 144.00),
('550e8400-e29b-41d4-a716-446655440001', '12:00', '15:00', true, 144.00),
('550e8400-e29b-41d4-a716-446655440001', '15:00', '18:00', true, 144.00),
('550e8400-e29b-41d4-a716-446655440001', '18:00', '21:00', true, 144.00),
('550e8400-e29b-41d4-a716-446655440001', '21:00', '24:00', false, 144.00);

