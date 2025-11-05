# StayU Backend Setup Guide

This guide will help you set up Supabase as the backend for your StayU application.

## Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: StayU (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" - this means the tables were created successfully!

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root of your project (same level as `package.json`)
2. Add the following variables:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` with your Project URL from Step 2
4. Replace `your_anon_key_here` with your anon/public key from Step 2

**Important**: Never commit your `.env` file to git! It's already in `.gitignore`.

## Step 5: Verify the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. The app should now load hotels from Supabase instead of static data.

3. Try creating a booking - it should save to your Supabase database.

## Step 6: View Your Data

In your Supabase dashboard:
- Go to **Table Editor** to see your hotels, time slots, and bookings
- You can manually add/edit hotels and time slots here
- Bookings will appear here when users make reservations

## Troubleshooting

### "Failed to load hotels" error

- Check that your `.env` file has the correct values
- Verify your Supabase project is active
- Make sure you ran the SQL migration (Step 3)
- Check the browser console for detailed error messages

### "Invalid API key" error

- Double-check your `REACT_APP_SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes
- Restart your development server after changing `.env`

### Database connection issues

- Verify your Supabase project is not paused (free tier projects pause after inactivity)
- Check your internet connection
- Try refreshing the Supabase dashboard

## Next Steps

Once your backend is set up, you can:

1. **Add more hotels**: Use the Supabase Table Editor or create an admin interface
2. **Set up authentication**: Supabase has built-in auth - you can add user accounts
3. **Add email notifications**: Use Supabase Edge Functions or third-party services
4. **Implement payment processing**: Integrate Stripe or similar payment gateway
5. **Add real-time updates**: Use Supabase's real-time features for live availability

## Database Schema Overview

- **hotels**: Stores hotel information (name, address, amenities, etc.)
- **time_slots**: Available time slots for each hotel
- **bookings**: Customer bookings with guest information

All tables have proper relationships and indexes for optimal performance.

