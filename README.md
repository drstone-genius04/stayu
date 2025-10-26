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
- **Tailwind CSS** for styling
- **Modern ES6+** features
- **Responsive Design** principles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── SearchForm.tsx  # Search and filter form
│   ├── HotelCard.tsx   # Individual hotel card
│   ├── HotelList.tsx   # Hotel listing component
│   └── BookingModal.tsx # Booking confirmation modal
├── data/               # Dummy data
│   └── hotels.ts       # Maryland hotel data
├── types/              # TypeScript type definitions
│   └── index.ts        # Interface definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
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
- Guest count selection
- Booking summary
- Confirmation modal

## Featured Hotel

The application features Hotel College Park Maryland with:
- Modern business accommodations near University of Maryland and NIST
- Multiple time slots with availability
- Premium amenities including WiFi, Parking, Business Center, Meeting Rooms
- Competitive hourly pricing
- High-quality images
- Excellent ratings and reviews

## Customization

### Adding New Hotels
Edit `src/data/hotels.ts` to add new hotels following the `Hotel` interface.

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
