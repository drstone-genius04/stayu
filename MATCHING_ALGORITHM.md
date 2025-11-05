# Intelligent Hotel Matching Algorithm

## Overview

The StayU platform now includes a sophisticated matching algorithm that finds the best hotel time slots based on user preferences, budget, distance, and time constraints.

## How It Works

### Input Parameters

Users provide:
- **Desired Start Time**: When they want to check in
- **Desired End Time**: When they want to check out
- **Target Location**: Latitude/longitude (or use current location)
- **Budget Range**: Minimum and maximum price they're willing to pay
- **Max Distance**: Optional maximum distance in kilometers
- **Guests**: Number of guests

### Algorithm Steps

1. **Filter by Budget**: Estimate total price based on desired duration and hourly rate
2. **Filter by Distance**: Calculate distance using Haversine formula and filter if exceeds max
3. **Find Best Time Slot**: For each hotel, find the time slot that:
   - Fits the desired duration
   - Minimizes time shift from user's preferred times
   - Uses 15-minute granularity for optimal matching
4. **Calculate Match Score**: Composite score based on:
   - **Time Shift (60% weight)**: How far off the slot is from user preference
   - **Distance (25% weight)**: Distance from target location
   - **Price Deviation (15% weight)**: How close price is to budget midpoint
5. **Rank Results**: Sort by match score (lower is better)

### Features

- **Flexible Time Matching**: Finds closest-fit slots even if exact match isn't available
- **Distance Calculation**: Uses Haversine formula for accurate geographic distance
- **Smart Ranking**: Weighted scoring ensures best overall matches appear first
- **Budget Filtering**: Only shows hotels within user's price range
- **Real-time Availability**: Works with live Supabase data

## Usage

### Enable Smart Matching

1. Fill in date, check-in, and check-out times
2. Expand "Advanced Search Options"
3. Enable "Smart Matching" checkbox
4. Optionally set:
   - Budget range
   - Max distance
   - Target location (or use current location)

### View Results

Matched hotels show:
- **Best Match Time Slot**: The optimal time slot found
- **Time Shift**: How many minutes off from your preference
- **Distance**: Distance from your target location
- **Matched Price**: Total price for the matched slot

## Example Output

When a user searches for:
- Date: 2025-11-04
- Check-in: 13:00
- Check-out: 17:00 (4 hours)
- Budget: $50-$150
- Location: College Park, MD

The algorithm might return:

```json
[
  {
    "hotel_name": "Hotel Alpha",
    "matchedSlot": {
      "startTime": "13:00",
      "endTime": "17:00",
      "price": 72.00
    },
    "timeShiftMinutes": 0,
    "distanceKm": 0.6,
    "matchScore": 2.5
  },
  {
    "hotel_name": "Metro Stay",
    "matchedSlot": {
      "startTime": "12:30",
      "endTime": "16:30",
      "price": 68.00
    },
    "timeShiftMinutes": 30,
    "distanceKm": 0.3,
    "matchScore": 12.3
  }
]
```

## Technical Details

### Distance Calculation

Uses the Haversine formula:
```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1-a))
distance = R × c
```

Where R = 6371 km (Earth's radius)

### Time Slot Matching

For each available slot:
1. Check if slot duration >= desired duration
2. Slide a window through the available slot in 15-minute increments
3. Find the start time that minimizes: `|slot_start - desired_start|`
4. Return the optimal start/end times

### Match Score Calculation

```typescript
matchScore = (timeShiftMinutes × 0.6) + 
             (distanceKm × 10 × 0.25) + 
             (priceDeviation / 10 × 0.15)
```

## Performance

- **Scalability**: Designed for 10+ hotels × 1000+ concurrent users
- **Efficiency**: O(n × m) where n = hotels, m = time slots per hotel
- **Optimization**: Uses indexed database queries and client-side filtering

## Future Enhancements

- [ ] Machine learning for personalized preferences
- [ ] Real-time availability updates
- [ ] Multi-day booking support
- [ ] Preference learning from booking history
- [ ] Integration with mapping services for better distance calculations

