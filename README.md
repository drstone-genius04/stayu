# StayU - Hourly Hotel Booking Platform

A modern React-based platform for booking hotels by the hour. This application features a clean, responsive design with Hotel College Park Maryland as the featured accommodation.

## Features

- **Hourly Hotel Booking**: Book hotels for as little as 3 hours
- **Search & Filter**: Find hotels by location, amenities, and price range
- **Real-time Availability**: View available time slots for each hotel
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional look
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 18** with TypeScript
- **Supabase** for backend (PostgreSQL database, authentication, real-time)
- **Tailwind CSS** for styling
- **Modern ES6+** features
- **Responsive Design** principles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier available)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase backend:
   - See [SETUP.md](./SETUP.md) for detailed backend setup instructions
   - Create a `.env` file with your Supabase credentials:
     ```env
     REACT_APP_SUPABASE_URL=your_supabase_project_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── SearchForm.tsx  # Search and filter form
│   ├── HotelCard.tsx   # Individual hotel card
│   ├── HotelList.tsx   # Hotel listing component
│   ├── BookingModal.tsx # Booking confirmation modal
│   └── ContactUs.tsx    # Contact form component
├── services/           # Backend service layer
│   ├── hotelService.ts # Hotel data operations
│   └── bookingService.ts # Booking operations
├── lib/                # Library configurations
│   ├── supabase.ts     # Supabase client setup
│   └── database.types.ts # Database type definitions
├── data/               # Static data (legacy, now using Supabase)
│   └── hotels.ts       # Maryland hotel data
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports

supabase/
└── migrations/         # Database migration files
    └── 001_initial_schema.sql # Initial database schema
```

## Features Overview

### Search & Filter
- Location-based search
- Time slot selection
- Guest count selection
- Amenity filtering
- Price range filtering

### Hotel Listings
- High-quality hotel images
- Detailed hotel information
- Real-time availability
- Star ratings and reviews
- Amenity listings

### Booking Flow
- Time slot selection
- Guest information collection (name, email, phone)
- Guest count selection
- Booking summary
- Real-time booking confirmation (saved to Supabase)
- Automatic availability updates

## Featured Hotel

The application features Hotel College Park Maryland with:
- Modern business accommodations near University of Maryland and NIST
- Multiple time slots with availability
- Premium amenities including WiFi, Parking, Business Center, Meeting Rooms
- Competitive hourly pricing
- High-quality images
- Excellent ratings and reviews

## Backend Setup

This application uses **Supabase** as the backend. See [SETUP.md](./SETUP.md) for complete setup instructions.

### Key Features:
- **PostgreSQL Database**: Relational database for hotels, time slots, and bookings
- **Real-time Updates**: Automatic availability updates
- **Row Level Security**: Secure data access policies
- **Auto-generated APIs**: RESTful APIs generated automatically

## Customization

### Adding New Hotels
You can add hotels through:
1. **Supabase Dashboard**: Use the Table Editor to add hotels directly
2. **SQL Scripts**: Run INSERT statements in the SQL Editor
3. **Admin Interface**: (Future feature) Build an admin panel for hotel management

### Styling
The application uses Tailwind CSS with custom color schemes. Modify `tailwind.config.js` to change the design system.

### Components
All components are modular and can be easily customized or extended.

## Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## License

This project is for educational purposes only. StayU is a demonstration platform showcasing hourly hotel booking capabilities.
