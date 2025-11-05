import { Hotel, TimeSlot } from '../types';

/**
 * Matching Service
 * Implements intelligent hotel matching algorithm that finds best-fit time slots
 * based on user preferences, budget, and distance constraints.
 */

export interface UserPreferences {
  desiredStart: Date;
  desiredEnd: Date;
  targetLocation: {
    lat: number;
    lng: number;
  };
  budgetMin: number;
  budgetMax: number;
  maxDistanceKm?: number;
  guests?: number;
}

export interface MatchedResult {
  hotel: Hotel;
  matchedSlot: {
    startTime: string;
    endTime: string;
    price: number;
    originalSlotId: string;
  };
  distanceKm: number;
  timeShiftMinutes: number;
  matchScore: number; // Composite score for ranking
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistanceKm = (
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(loc2.lat - loc1.lat);
  const dLng = toRadians(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.lat)) *
      Math.cos(toRadians(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Parse time string (HH:MM) to Date object for today
 */
const parseTimeToDate = (timeString: string, date: Date): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

/**
 * Calculate duration in hours between two times
 * Handles next-day end times (e.g., 23:00 to 02:00)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const calculateDurationHours = (startTime: string, endTime: string, date: Date): number => {
  const start = parseTimeToDate(startTime, date);
  let end = parseTimeToDate(endTime, date);

  // Handle next-day end times
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

/**
 * Find the best matching time slot within an available slot
 * Returns the optimal start/end times that minimize time shift from user preference
 */
const findBestTimeSlot = (
  availStart: string,
  availEnd: string,
  desiredStart: Date,
  desiredEnd: Date,
  baseDate: Date
): { start: Date; end: Date; shiftMinutes: number } | null => {
  const availStartDate = parseTimeToDate(availStart, baseDate);
  let availEndDate = parseTimeToDate(availEnd, baseDate);

  // Handle next-day end times
  if (availEndDate <= availStartDate) {
    availEndDate.setDate(availEndDate.getDate() + 1);
  }

  const desiredDuration = desiredEnd.getTime() - desiredStart.getTime();
  const availDuration = availEndDate.getTime() - availStartDate.getTime();

  // Check if available slot is long enough
  if (availDuration < desiredDuration) {
    return null;
  }

  // Find the best start time within the available window
  const latestPossibleStart = new Date(availEndDate.getTime() - desiredDuration);
  let bestStart = availStartDate;
  let minShift = Math.abs(bestStart.getTime() - desiredStart.getTime());

  // Try sliding window with 15-minute granularity
  const stepMinutes = 15;
  let currentStart = new Date(availStartDate);

  while (currentStart <= latestPossibleStart) {
    const shift = Math.abs(currentStart.getTime() - desiredStart.getTime());
    if (shift < minShift) {
      minShift = shift;
      bestStart = new Date(currentStart);
    }
    currentStart = new Date(currentStart.getTime() + stepMinutes * 60 * 1000);
  }

  const bestEnd = new Date(bestStart.getTime() + desiredDuration);

  // Ensure the slot fits within available window
  if (bestEnd > availEndDate) {
    return null;
  }

  return {
    start: bestStart,
    end: bestEnd,
    shiftMinutes: minShift / (1000 * 60), // Convert to minutes
  };
};

/**
 * Format Date to time string (HH:MM)
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Main matching function that finds best hotel matches for user preferences
 */
export const matchUserWithHotels = (
  userPrefs: UserPreferences,
  hotels: Hotel[]
): MatchedResult[] => {
  const matchedResults: MatchedResult[] = [];
  const desiredDuration = userPrefs.desiredEnd.getTime() - userPrefs.desiredStart.getTime();
  const desiredDurationHours = desiredDuration / (1000 * 60 * 60);

  // Use the date from desiredStart as the base date
  const baseDate = new Date(userPrefs.desiredStart);
  baseDate.setHours(0, 0, 0, 0);

  for (const hotel of hotels) {
    // Step 1: Filter by distance
    const distance = calculateDistanceKm(userPrefs.targetLocation, hotel.coordinates);
    if (userPrefs.maxDistanceKm && distance > userPrefs.maxDistanceKm) {
      continue;
    }

    // Step 2: Filter by budget (estimated price)
    const estimatedPrice = hotel.pricePerHour * desiredDurationHours;
    if (estimatedPrice < userPrefs.budgetMin || estimatedPrice > userPrefs.budgetMax) {
      continue;
    }

    // Step 3: Find best matching time slot
    let bestMatch: {
      start: Date;
      end: Date;
      shiftMinutes: number;
      slot: TimeSlot;
    } | null = null;

    for (const slot of hotel.availableTimeSlots) {
      if (!slot.available) continue;

      const match = findBestTimeSlot(
        slot.startTime,
        slot.endTime,
        userPrefs.desiredStart,
        userPrefs.desiredEnd,
        baseDate
      );

      if (match && (!bestMatch || match.shiftMinutes < bestMatch.shiftMinutes)) {
        bestMatch = {
          start: match.start,
          end: match.end,
          shiftMinutes: match.shiftMinutes,
          slot,
        };
      }
    }

    if (bestMatch) {
      // Use the time slot's actual price (different prices for different time slots)
      const finalPrice = bestMatch.slot.price;

      // Calculate composite match score (lower is better)
      // Weighted by: time shift (60%), distance (25%), price deviation (15%)
      const timeScore = bestMatch.shiftMinutes; // minutes
      const distanceScore = distance * 10; // scale distance
      const priceDeviation = Math.abs(finalPrice - (userPrefs.budgetMin + userPrefs.budgetMax) / 2);
      const priceScore = priceDeviation / 10; // scale price

      const matchScore = timeScore * 0.6 + distanceScore * 0.25 + priceScore * 0.15;

      matchedResults.push({
        hotel,
        matchedSlot: {
          startTime: formatTime(bestMatch.start),
          endTime: formatTime(bestMatch.end),
          price: finalPrice,
          originalSlotId: bestMatch.slot.id,
        },
        distanceKm: distance,
        timeShiftMinutes: Math.round(bestMatch.shiftMinutes),
        matchScore,
      });
    }
  }

  // Step 4: Sort by match score (best matches first)
  matchedResults.sort((a, b) => a.matchScore - b.matchScore);

  return matchedResults;
};

/**
 * Helper to convert SearchFilters to UserPreferences
 */
export const convertFiltersToPreferences = (
  filters: {
    date: string;
    checkIn: string;
    checkOut: string;
    budgetMin?: number;
    budgetMax?: number;
    maxDistanceKm?: number;
    targetLocation?: { lat: number; lng: number };
  }
): UserPreferences | null => {
  if (!filters.date || !filters.checkIn || !filters.checkOut) {
    return null;
  }

  const date = new Date(filters.date);
  const [startHour, startMin] = filters.checkIn.split(':').map(Number);
  const [endHour, endMin] = filters.checkOut.split(':').map(Number);

  const desiredStart = new Date(date);
  desiredStart.setHours(startHour, startMin, 0, 0);

  const desiredEnd = new Date(date);
  desiredEnd.setHours(endHour, endMin, 0, 0);

  // Handle next-day end times
  if (desiredEnd <= desiredStart) {
    desiredEnd.setDate(desiredEnd.getDate() + 1);
  }

  return {
    desiredStart,
    desiredEnd,
    targetLocation: filters.targetLocation || { lat: 38.9907, lng: -76.9361 }, // Default to College Park
    budgetMin: filters.budgetMin || 0,
    budgetMax: filters.budgetMax || 1000,
    maxDistanceKm: filters.maxDistanceKm,
  };
};

