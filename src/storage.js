import {
  STORAGE_KEYS,
  defaultFamilyMembers,
  demoAttorney,
} from './data.js';

const read = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const store = {
  getUser: () => read(STORAGE_KEYS.user, null),
  setUser: (user) => write(STORAGE_KEYS.user, user),
  getJourneys: () => read(STORAGE_KEYS.journeys, []),
  setJourneys: (journeys) => write(STORAGE_KEYS.journeys, journeys),
  getIncidents: () => read(STORAGE_KEYS.incidents, []),
  setIncidents: (incidents) => write(STORAGE_KEYS.incidents, incidents),
  getOffers: () => read(STORAGE_KEYS.offers, []),
  setOffers: (offers) => write(STORAGE_KEYS.offers, offers),
  getFamily: () => read(STORAGE_KEYS.family, defaultFamilyMembers),
  setFamily: (members) => write(STORAGE_KEYS.family, members),
  getActiveJourney: () => read(STORAGE_KEYS.activeJourney, null),
  setActiveJourney: (journey) => write(STORAGE_KEYS.activeJourney, journey),
  clearActiveJourney: () => localStorage.removeItem(STORAGE_KEYS.activeJourney),
  getActiveIncident: () => read(STORAGE_KEYS.activeIncident, null),
  setActiveIncident: (incident) => write(STORAGE_KEYS.activeIncident, incident),
  getAttorneyAvailable: () => read(STORAGE_KEYS.attorneyAvailable, demoAttorney.available),
  setAttorneyAvailable: (available) => write(STORAGE_KEYS.attorneyAvailable, available),
  getSponsorDismissed: () => read(STORAGE_KEYS.sponsorDismissed, false),
  setSponsorDismissed: (dismissed) => write(STORAGE_KEYS.sponsorDismissed, dismissed),
};

export function createDemoUser(accountType = 'driver', overrides = {}) {
  const base = {
    id: makeId('user'),
    name:
      accountType === 'attorney'
        ? 'Sarah Mitchell'
        : accountType === 'family'
          ? 'Jordan Family'
          : 'Maya Carter',
    email:
      accountType === 'attorney'
        ? 'sarah@mitchellroadside.com'
        : accountType === 'family'
          ? 'family@lawcall.demo'
          : 'maya@lawcall.demo',
    phone: '(555) 013-7711',
    accountType,
    plan: accountType === 'driver' ? 'Free Driver' : accountType === 'family' ? 'Family Protection' : 'Attorney Network',
    region: 'California',
    language: 'English',
    trustedContacts: [
      {
        id: 'contact-jordan',
        name: 'Jordan Lee',
        relationship: 'Partner',
        phone: '(555) 019-2214',
        email: 'jordan@example.com',
        notify: true,
        sharePacket: true,
      },
    ],
    vehicles: [
      {
        id: 'vehicle-1',
        make: 'Tesla',
        model: 'Model 3',
        year: '2024',
        plate: 'LCL-204',
        color: 'Black',
        decal: 'Installed',
      },
    ],
    documents: [
      { id: 'doc-license', name: 'Driver License', status: 'Saved' },
      { id: 'doc-insurance', name: 'Insurance', status: 'Saved' },
      { id: 'doc-registration', name: 'Registration', status: 'Needed' },
    ],
    familyMembers: defaultFamilyMembers,
    autoStartBluetooth: true,
    carBluetoothName: 'Maya Civic Bluetooth',
    notificationTone: 'Protected Journey Alert',
    ...overrides,
  };

  store.setUser(base);
  return base;
}

export function startJourney() {
  const user = store.getUser() || createDemoUser();
  const journey = {
    id: makeId('journey'),
    userId: user.id,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    distance: null,
    status: 'active',
    incidentId: null,
    autoStartedBy: user.autoStartBluetooth ? 'Car Bluetooth' : 'Manual',
  };
  store.setActiveJourney(journey);
  return journey;
}

export function completeSafetyRun() {
  const active = store.getActiveJourney() || startJourney();
  const duration = Math.max(12, Math.round((Date.now() - new Date(active.startTime).getTime()) / 60000) || 22);
  const journey = {
    ...active,
    endTime: new Date().toISOString(),
    duration: `${duration} min`,
    distance: `${(duration * 0.72).toFixed(1)} mi`,
    status: 'safety_run',
  };
  store.setJourneys([journey, ...store.getJourneys()]);
  store.clearActiveJourney();
  return journey;
}

export function createEmergencyIncident(type = 'Traffic Stop') {
  const user = store.getUser() || createDemoUser();
  const journey = store.getActiveJourney() || startJourney();
  const incident = {
    id: makeId('incident'),
    userId: user.id,
    journeyId: journey.id,
    type,
    createdAt: new Date().toISOString(),
    location: 'W Sunset Blvd & N Fairfax Ave, Los Angeles, CA',
    gps: '34.0983, -118.3617',
    recordingStatus: 'Active / Saved',
    attorneyConnected: false,
    attorneyName: demoAttorney.name,
    trustedContactsNotified: true,
    notes: 'Driver activated Law Call Active during a roadside incident.',
    documents: [],
    followUpNeeded: true,
    status: 'open',
    consultationStatus: 'Requested',
    transactionStatus: 'Offer not sent',
  };
  store.setActiveIncident(incident);
  const savedIncidents = store.getIncidents();
  store.setIncidents([incident, ...savedIncidents.filter((item) => item.id !== incident.id)]);
  store.setActiveJourney({ ...journey, status: 'incident_run', incidentId: incident.id });
  return incident;
}

export function connectAttorney() {
  const incident = store.getActiveIncident() || createEmergencyIncident();
  const updated = {
    ...incident,
    attorneyConnected: true,
    attorneyName: demoAttorney.name,
    consultationStatus: 'Connected',
  };
  store.setActiveIncident(updated);
  store.setIncidents(store.getIncidents().map((item) => (item.id === updated.id ? updated : item)));
  return updated;
}

export function saveIncidentPatch(patch) {
  const active = store.getActiveIncident() || createEmergencyIncident();
  const updated = { ...active, ...patch };
  store.setActiveIncident(updated);
  store.setIncidents(store.getIncidents().map((item) => (item.id === updated.id ? updated : item)));
  return updated;
}

export function addIncidentDocument(name) {
  const active = store.getActiveIncident() || createEmergencyIncident();
  const updated = {
    ...active,
    documents: [
      ...active.documents,
      {
        id: makeId('document'),
        name,
        status: 'Uploaded',
        uploadedAt: new Date().toISOString(),
      },
    ],
  };
  store.setActiveIncident(updated);
  store.setIncidents(store.getIncidents().map((item) => (item.id === updated.id ? updated : item)));
  return updated;
}

export function sendRepresentationOffer(payload) {
  const incident = store.getActiveIncident() || createEmergencyIncident();
  const offer = {
    id: makeId('offer'),
    incidentId: incident.id,
    attorneyName: demoAttorney.name,
    status: 'Offer sent',
    agreementStatus: 'Not viewed',
    transactionStatus: 'Offer sent',
    sentAt: new Date().toISOString(),
    ...payload,
  };
  store.setOffers([offer, ...store.getOffers()]);
  saveIncidentPatch({
    transactionStatus: 'Offer sent',
    representationOfferId: offer.id,
  });
  return offer;
}
