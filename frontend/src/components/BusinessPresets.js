export const BUSINESS_CATEGORIES = [
  {
    id: 'restaurant',
    name: 'Restaurant / Cafe',
    icon: 'Utensils',
    chips: [
      'Delicious Food',
      'Warm Atmosphere',
      'Fast Service',
      'Friendly Staff',
      'Great Value',
      'Clean Environment',
      'Fresh Ingredients',
      'Unique Cocktails'
    ],
    defaultKeywords: 'best restaurant, delicious food, top lunch spot, dinner',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Example Google Place ID
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    id: 'salon',
    name: 'Salon / Barber / Spa',
    icon: 'Scissors',
    chips: [
      'Skilled Stylist',
      'Great Haircut',
      'Spotless Salon',
      'Friendly Service',
      'On-Time Appointment',
      'Relaxing Vibe',
      'Fair Pricing',
      'Attention to Detail'
    ],
    defaultKeywords: 'best salon, expert hair stylist, top haircut, beauty treatment',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    id: 'medical',
    name: 'Clinic / Dental / Care',
    icon: 'Stethoscope',
    chips: [
      'Gentle & Caring',
      'Zero Wait Time',
      'Clean Clinic',
      'Knowledgeable Doctor',
      'Courteous Staff',
      'Pain-Free Treatment',
      'Clear Explanation',
      'Top Technology'
    ],
    defaultKeywords: 'top dentist, best medical clinic, caring doctor, painless dental',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    id: 'auto',
    name: 'Auto Repair / Garage',
    icon: 'Car',
    chips: [
      'Honest Pricing',
      'Fast Turnaround',
      'Expert Mechanics',
      'Clear Diagnostics',
      'Great Communication',
      'Clean Waiting Area',
      'Trustworthy Service'
    ],
    defaultKeywords: 'honest mechanic, best auto repair, quick oil change, brake service',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    id: 'home_services',
    name: 'Plumbing / HVAC / Electrician',
    icon: 'Wrench',
    chips: [
      'Punctual Arrival',
      'Clean Worksite',
      'Fair Estimate',
      'Fixed Right First Time',
      'Professional Technician',
      'Emergency Response'
    ],
    defaultKeywords: 'reliable plumber, 24/7 electrician, hvac repair expert',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    id: 'retail',
    name: 'Retail Store / Boutique',
    icon: 'ShoppingBag',
    chips: [
      'Great Selection',
      'Helpful Staff',
      'Quality Products',
      'Fair Prices',
      'Beautiful Display',
      'Easy Checkout'
    ],
    defaultKeywords: 'best local shop, clothing boutique, gift store',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  }
];

export const DEMO_BUSINESS = {
  id: 'bizz_101',
  name: 'Bella Vista Gourmet Bistro',
  tagline: 'Authentic Italian Dining & Fine Wine',
  category: 'restaurant',
  ownerName: 'Marco Rossi',
  email: 'marco@bellavistabistro.com',
  phone: '+1 (555) 234-5678',
  logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
  googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  targetKeywords: 'best Italian restaurant, romantic dinner, fresh pasta, fine wine',
  offerBanner: '🎉 Thank you for visiting! Rate your experience & get a free dessert coupon!',
  totalScans: 1240,
  googleReviewCount: 382,
  avgRating: 4.9,
  interceptedBadReviews: 24
};

export const INITIAL_INTERNAL_FEEDBACK = [
  {
    id: 'fb_1',
    date: '2026-09-06 19:42',
    rating: 2,
    customerName: 'Sarah M.',
    customerContact: 'sarah.m@example.com',
    chips: ['Fast Service', 'Clean Environment'],
    message: 'The food taste was wonderful, but we waited 45 minutes for our entrees. The waiter was apologetic, but timing ruined our night.',
    status: 'Unresolved'
  },
  {
    id: 'fb_2',
    date: '2026-09-05 14:15',
    rating: 3,
    customerName: 'David K.',
    customerContact: 'davidk@example.com',
    chips: ['Great Value'],
    message: 'The outdoor seating area was a bit noisy and dusty. Pasta portions felt smaller than usual compared to our last visit.',
    status: 'Resolved'
  }
];
