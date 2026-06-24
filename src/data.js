export const STORAGE_KEYS = {
  user: 'lawCall:user',
  journeys: 'lawCall:journeys',
  activeJourney: 'lawCall:activeJourney',
  incidents: 'lawCall:incidents',
  activeIncident: 'lawCall:activeIncident',
  family: 'lawCall:family',
  attorneyAvailable: 'lawCall:attorneyAvailable',
  offers: 'lawCall:offers',
  sponsorDismissed: 'lawCall:sponsorDismissed',
};

export const demoAttorney = {
  id: 'attorney-sarah-mitchell',
  name: 'Sarah Mitchell',
  title: 'Traffic & Criminal Defense Attorney',
  firm: 'Mitchell Roadside Legal Group',
  jurisdiction: 'California',
  practiceAreas: ['Traffic Stop', 'DUI', 'Accident', 'Criminal Defense'],
  languages: ['English', 'Spanish'],
  responseTime: '42 sec',
  verified: true,
  available: true,
};

export const legalNotice =
  'Attorney listings are paid advertising/listing placements. Law Call does not recommend or rank attorneys as best. Users choose whether to contact or hire a participating attorney. Follow-up representation requires a separate attorney-client agreement.';

export const consumerPromise =
  'Free to download. Free to start a protected journey. No upfront cost to connect with a participating attorney for an initial consultation, where available.';

export const consultationCopy =
  'Participating attorneys may offer an initial 30-60 minute consultation at no upfront cost. If the user chooses to hire an attorney for representation, follow-up legal work requires a separate attorney-client agreement and payment.';

export const platformDisclaimer =
  'Law Call is a technology platform prototype. It does not provide legal advice, does not guarantee attorney availability, and does not guarantee legal outcomes. Future live versions may connect users with participating attorneys where available. Laws vary by jurisdiction. Users should comply with lawful instructions and local laws.';

export const defaultFamilyMembers = [
  {
    id: 'family-alex',
    name: 'Alex',
    role: 'Teen Driver',
    journeys: 34,
    safetyRuns: 33,
    incidents: 1,
    lastJourney: 'Today',
  },
  {
    id: 'family-margaret',
    name: 'Margaret',
    role: 'Elderly Parent',
    journeys: 18,
    safetyRuns: 18,
    incidents: 0,
    lastJourney: 'Yesterday',
  },
  {
    id: 'family-sara',
    name: 'Sara',
    role: 'Spouse',
    journeys: 52,
    safetyRuns: 50,
    incidents: 2,
    lastJourney: '2 days ago',
  },
  {
    id: 'family-omar',
    name: 'Omar',
    role: 'International Student',
    journeys: 22,
    safetyRuns: 20,
    incidents: 0,
    lastJourney: 'Today',
  },
];

export const demoRequests = [
  {
    id: 'request-traffic-stop',
    type: 'Traffic Stop',
    distance: '2.1 miles away',
    jurisdiction: 'California',
    status: 'urgent',
    consultationStatus: 'Requested',
    potentialCaseValue: '$750-$2,500',
    packet: true,
    representationRequested: false,
  },
  {
    id: 'request-ticket',
    type: 'Ticket Follow-Up',
    distance: 'Uploaded citation',
    jurisdiction: 'California',
    status: 'follow-up',
    consultationStatus: 'Completed',
    potentialCaseValue: '$350-$900',
    packet: true,
    representationRequested: true,
  },
  {
    id: 'request-accident',
    type: 'Accident Help',
    distance: 'Location saved',
    jurisdiction: 'California',
    status: 'pending',
    consultationStatus: 'Scheduled',
    potentialCaseValue: '$1,500-$7,500',
    packet: true,
    representationRequested: true,
  },
];

export const attorneyPlans = [
  {
    name: 'Free Attorney Starter',
    price: '$0',
    cadence: '/month',
    features: [
      '1 practice-area listing',
      '1 postcode/ZIP code',
      'Basic profile',
      'Manual availability toggle',
      'Limited consultation requests',
    ],
  },
  {
    name: 'Local Attorney Plan',
    price: '$19.95',
    cadence: '/month',
    featured: true,
    features: [
      '1 practice-area listing',
      'Up to 5 postcodes',
      'Request inbox',
      'Incident Packet preview',
      'Follow-up lead access',
    ],
  },
  {
    name: 'Growth Plan',
    price: '$49.95',
    cadence: '/month',
    features: [
      'Up to 3 practice-area listings',
      'Up to 15 postcodes',
      'Priority visibility when available',
      'Ticket/citation follow-up leads',
      'Profile analytics',
    ],
  },
  {
    name: 'Territory Plan',
    price: '$99.95',
    cadence: '/month',
    features: [
      'Up to 5 practice-area listings',
      'Up to 50 postcodes',
      'Firm profile',
      'Higher placement',
      'Advanced lead dashboard',
      'Call performance stats',
    ],
  },
  {
    name: 'Firm / Regional Plan',
    price: 'Custom',
    cadence: '',
    features: [
      'Multi-attorney firm account',
      'Regional coverage',
      'Practice-area bundles',
      'Sponsored placement',
      'Advanced reporting',
    ],
  },
];
