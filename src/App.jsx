import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  BluetoothConnected,
  BriefcaseBusiness,
  Car,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Contact,
  FileCheck2,
  FilePenLine,
  Gauge,
  Handshake,
  Home,
  LandPlot,
  LocateFixed,
  LockKeyhole,
  MapPin,
  Menu,
  MessageSquareText,
  PhoneCall,
  Plus,
  Radio,
  Shield,
  Siren,
  Sparkles,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  attorneyPlans,
  consultationCopy,
  consumerPromise,
  defaultFamilyMembers,
  demoAttorney,
  demoRequests,
  legalNotice,
  platformDisclaimer,
} from './data.js';
import {
  addIncidentDocument,
  completeSafetyRun,
  connectAttorney,
  createDemoUser,
  createEmergencyIncident,
  saveIncidentPatch,
  sendRepresentationOffer,
  startJourney,
  store,
} from './storage.js';

const navItems = [
  { to: '/dashboard', label: 'Driver', icon: Gauge },
  { to: '/journey', label: 'Journey', icon: Car },
  { to: '/packet', label: 'Packet', icon: FileCheck2 },
  { to: '/family', label: 'Family', icon: Users },
  { to: '/attorney', label: 'Attorney', icon: BriefcaseBusiness },
  { to: '/pricing', label: 'Pricing', icon: CircleDollarSign },
  { to: '/settings', label: 'Account', icon: LockKeyhole },
];

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));

function useStoredState(loader) {
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((item) => item + 1);
  return [loader(version), refresh];
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<DemoLogin />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/journey" element={<JourneyMode />} />
        <Route path="/active" element={<LawCallActive />} />
        <Route path="/attorney-connected" element={<AttorneyConnected />} />
        <Route path="/packet" element={<IncidentPacket />} />
        <Route path="/family" element={<FamilyDashboard />} />
        <Route path="/attorney" element={<AttorneyDashboard />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/settings" element={<AccountSettings />} />
      </Route>
    </Routes>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmergency = location.pathname === '/active';
  const user = store.getUser();

  const launchEmergency = (type = 'Traffic Stop') => {
    createEmergencyIncident(type);
    navigate('/active');
  };

  if (isEmergency) {
    return (
      <main className="emergency-frame">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand-lockup" to="/dashboard" aria-label="Law Call home">
          <span className="brand-mark">
            <Shield size={24} />
          </span>
          <span>
            <strong>Law Call</strong>
            <small>Protected driving system</small>
          </span>
        </Link>
        <nav className="side-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-status">
          <span className="status-dot" />
          <div>
            <strong>Protection Ready</strong>
            <small>{user?.plan || 'Free Driver'} access</small>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <Topbar onEmergency={launchEmergency} />
        <div className="route-surface">
          <Outlet />
        </div>
      </main>

      {!isEmergency && <FloatingEmergencyButton onClick={() => launchEmergency('Traffic Stop')} />}
      <MobileBottomNav onEmergency={() => launchEmergency('Traffic Stop')} />
    </div>
  );
}

function Topbar({ onEmergency }) {
  const [open, setOpen] = useState(false);
  const user = store.getUser();

  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <Link className="topbar-brand mobile-only" to="/dashboard">
        <Shield size={18} /> Law Call
      </Link>
      <div className="topbar-promise">
        <BadgeCheck size={18} />
        <span>Free driver app</span>
        <strong>Document. Alert. Connect. Guide. Preserve.</strong>
      </div>
      <button className="danger-button compact" onClick={onEmergency}>
        <Siren size={18} />
        I'm Being Stopped
      </button>
      <div className="user-chip">
        <span>{user?.name?.slice(0, 1) || 'L'}</span>
        <div>
          <strong>{user?.name || 'Demo Driver'}</strong>
          <small>{user?.region || 'California'}</small>
        </div>
      </div>
      {open && (
        <div className="mobile-drawer" role="dialog" aria-label="Navigation menu">
          <button className="icon-button drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
          <Link className="brand-lockup" to="/dashboard" onClick={() => setOpen(false)}>
            <span className="brand-mark">
              <Shield size={24} />
            </span>
            <span>
              <strong>Law Call</strong>
              <small>Protected driving system</small>
            </span>
          </Link>
          <nav className="side-nav">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function LayoutPage({ eyebrow, title, subtitle, children, action }) {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function GlassCard({ children, className = '', tone = '' }) {
  return <div className={`glass-card ${tone} ${className}`}>{children}</div>;
}

function StatCard({ icon: Icon, label, value, detail, tone = '' }) {
  return (
    <GlassCard className={`stat-card ${tone}`}>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </GlassCard>
  );
}

function Badge({ children, tone = 'blue', icon: Icon }) {
  return (
    <span className={`badge badge-${tone}`}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}

function LegalDisclaimer({ compact = false }) {
  return (
    <GlassCard className={compact ? 'legal-card compact-legal' : 'legal-card'}>
      <Badge tone="cyan" icon={LockKeyhole}>
        Legal notice
      </Badge>
      <p>{platformDisclaimer}</p>
      <p>{legalNotice}</p>
    </GlassCard>
  );
}

function SponsorStrip() {
  const [dismissed, setDismissed] = useState(store.getSponsorDismissed());
  if (dismissed) return null;

  return (
    <div className="sponsor-strip">
      <div>
        <Badge tone="purple" icon={Sparkles}>
          Sponsor-safe zone
        </Badge>
        <strong>Presented by trusted roadside, insurance, university, and mobility partners.</strong>
        <span>Sponsored messages never appear during Law Call Active.</span>
      </div>
      <button
        className="icon-button"
        onClick={() => {
          store.setSponsorDismissed(true);
          setDismissed(true);
        }}
        aria-label="Dismiss sponsor message"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function FloatingEmergencyButton({ onClick }) {
  return (
    <button className="floating-emergency" onClick={onClick}>
      <Siren size={22} />
      I'm Being Stopped
    </button>
  );
}

function MobileBottomNav({ onEmergency }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/dashboard">
        <Home size={18} />
        Home
      </NavLink>
      <NavLink to="/journey">
        <Car size={18} />
        Journey
      </NavLink>
      <button onClick={onEmergency}>
        <Siren size={20} />
        Stop
      </button>
      <NavLink to="/packet">
        <FileCheck2 size={18} />
        Packet
      </NavLink>
      <NavLink to="/settings">
        <LockKeyhole size={18} />
        Account
      </NavLink>
    </nav>
  );
}

function PrimaryButton({ children, onClick, to, className = '', icon: Icon = ChevronRight, type = 'button' }) {
  const content = (
    <>
      {children}
      {Icon && <Icon size={18} />}
    </>
  );

  if (to) {
    return (
      <Link className={`primary-button ${className}`} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`primary-button ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}

function SecondaryButton({ children, onClick, to, className = '', icon: Icon, type = 'button' }) {
  const content = (
    <>
      {Icon && <Icon size={17} />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link className={`secondary-button ${className}`} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`secondary-button ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}

function DangerButton({ children, onClick, className = '', icon: Icon = Siren }) {
  return (
    <button className={`danger-button ${className}`} onClick={onClick}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const startDemo = () => {
    createDemoUser('driver');
    navigate('/dashboard');
  };

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand-lockup" to="/">
          <span className="brand-mark">
            <Shield size={24} />
          </span>
          <span>
            <strong>Law Call</strong>
            <small>Roadside legal protection</small>
          </span>
        </Link>
        <nav>
          <a href="#how">How it works</a>
          <a href="#attorneys">Attorneys</a>
          <Link to="/pricing">Pricing</Link>
          <Link className="nav-login" to="/login">
            Start Demo
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-media" aria-hidden="true">
          <img src="lawcall-hero.png" alt="" />
        </div>
        <div className="hero-copy">
          <Badge tone="red" icon={Siren}>
            Free driver app
          </Badge>
          <h1>Your Journey Is Now Protected.</h1>
          <p>
            Law Call gives drivers and families one-tap roadside legal protection with Journey
            Mode, trusted-contact alerts, participating attorney discovery, secure incident
            records, and post-stop support.
          </p>
          <div className="hero-actions">
            <PrimaryButton onClick={startDemo} icon={Shield}>
              Start Demo
            </PrimaryButton>
            <a className="secondary-button" href="#how">
              See How It Works
              <ChevronRight size={18} />
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <strong>$0</strong>
              Drivers
            </span>
            <span>
              <strong>30-60</strong>
              Initial consultation minutes where available
            </span>
            <span>
              <strong>Ad-free</strong>
              Emergency mode
            </span>
          </div>
        </div>

        <div className="hero-device">
          <GlassCard className="mock-phone">
            <div className="phone-top">
              <span className="status-dot" />
              <strong>Journey Mode Active</strong>
            </div>
            <h2>Your Journey Is Now Protected.</h2>
            <div className="phone-grid">
              <span>
                <Car size={16} /> Protected journeys
              </span>
              <span>
                <Shield size={16} /> Safety runs
              </span>
              <span>
                <BriefcaseBusiness size={16} /> Attorney ready
              </span>
              <span>
                <Users size={16} /> Family protected
              </span>
            </div>
            <DangerButton onClick={startDemo}>I'm Being Stopped</DangerButton>
            <p>{consumerPromise}</p>
          </GlassCard>
        </div>
      </section>

      <section className="fear-band">
        <h2>The panic starts before the officer reaches the window.</h2>
        <p>
          Law Call gives drivers a calm, guided, documented way through the moment. The correct
          promise is simple: document, alert, connect, guide, preserve.
        </p>
      </section>

      <section id="how" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Before / During / After</span>
          <h2>Built around the three moments that matter.</h2>
        </div>
        <div className="three-grid">
          <FeatureCard icon={BluetoothConnected} title="Start every drive protected." text="Auto-start Journey Mode can be mocked through car Bluetooth settings so protection begins before stress starts." />
          <FeatureCard icon={Siren} title="One tap activates Law Call Active." text="Emergency mode stays serious, clean, and ad-free with location, recording status, alerts, and attorney routing simulation." />
          <FeatureCard icon={FileCheck2} title="Every incident becomes a secure legal record." text="Incident Packet preserves the timeline, location, documents, consultation state, and follow-up actions." />
        </div>
      </section>

      <section className="content-section split-section">
        <div>
          <span className="eyebrow">Included Initial Consultation</span>
          <h2>No upfront attorney cost at the moment of stress.</h2>
          <p>{consultationCopy}</p>
          <PrimaryButton to="/login" icon={PhoneCall}>
            Try Consumer Flow
          </PrimaryButton>
        </div>
        <GlassCard className="authority-panel">
          <Badge tone="cyan" icon={Handshake}>
            Attorney marketplace
          </Badge>
          <h3>High-intent consultation requests for participating attorneys.</h3>
          <p>
            Attorneys can provide an included initial consultation and convert qualified incidents
            into paid follow-up representation where appropriate.
          </p>
          <div className="mini-metrics">
            <span>
              <strong>42 sec</strong>
              avg response
            </span>
            <span>
              <strong>$49.95</strong>
              growth plan
            </span>
            <span>
              <strong>Packet</strong>
              preview ready
            </span>
          </div>
        </GlassCard>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Who it protects</span>
          <h2>Designed for people who cannot afford confusion in the moment.</h2>
        </div>
        <div className="audience-grid">
          {[
            'Everyday drivers',
            'Parents of teen drivers',
            'Elderly drivers and caregivers',
            'Tourists and rental car drivers',
            'Immigrants and international students',
            'Rideshare and delivery drivers',
            'Attorneys',
            'Families who want peace of mind',
          ].map((item) => (
            <GlassCard key={item} className="audience-card">
              <Shield size={20} />
              <strong>{item}</strong>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Core system</span>
          <h2>Free for drivers. Monetized through attorney tools and sponsors.</h2>
        </div>
        <div className="feature-grid">
          {[
            ['Journey Mode', Car],
            ['One-tap emergency activation', Siren],
            ['Calm Mode', Shield],
            ['Location/time capture', LocateFixed],
            ['Trusted-contact alerts', Bell],
            ['Attorney discovery', BriefcaseBusiness],
            ['Incident Packet', FileCheck2],
            ['Ticket upload', Upload],
            ['Family Protection', Users],
            ['Attorney Network', Handshake],
            ['Representation offers', FilePenLine],
            ['Sponsor-safe placements', Sparkles],
          ].map(([label, Icon]) => (
            <FeaturePill key={label} icon={Icon} label={label} />
          ))}
        </div>
      </section>

      <section id="attorneys" className="content-section split-section">
        <GlassCard className="attorney-ad-card">
          <Badge tone="purple" icon={BriefcaseBusiness}>
            Attorney-side revenue
          </Badge>
          <h2>Paid listings, local coverage, follow-up opportunities.</h2>
          <p>
            Law Call delivers high-intent roadside legal consultation requests. Participating
            attorneys can convert appropriate incidents into paid representation with a separate
            agreement.
          </p>
          <SecondaryButton to="/attorney" icon={LandPlot}>
            View Attorney Network
          </SecondaryButton>
        </GlassCard>
        <LegalDisclaimer />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <GlassCard className="feature-card">
      <div className="feature-icon">
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </GlassCard>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <GlassCard className="feature-pill">
      <Icon size={20} />
      <span>{label}</span>
    </GlassCard>
  );
}

function DemoLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Maya Carter',
    email: 'maya@lawcall.demo',
    phone: '(555) 013-7711',
    region: 'California',
    accountType: 'driver',
    plan: 'Free Driver',
  });

  const login = (type) => {
    const user = createDemoUser(type, {
      ...form,
      accountType: type,
      plan: type === 'attorney' ? 'Attorney Network' : type === 'family' ? 'Family Protection' : 'Free Driver',
    });
    if (user.accountType === 'attorney') navigate('/attorney');
    else if (user.accountType === 'family') navigate('/family');
    else navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <Link className="brand-lockup" to="/">
        <span className="brand-mark">
          <Shield size={24} />
        </span>
        <span>
          <strong>Law Call</strong>
          <small>Demo access</small>
        </span>
      </Link>
      <GlassCard className="auth-card">
        <Badge tone="red" icon={Zap}>
          Investor demo
        </Badge>
        <h1>Enter the protected driving system.</h1>
        <p>
          Choose a demo role. Driver access is free, with initial consultation access from
          participating attorneys where available.
        </p>
        <div className="login-buttons">
          <button onClick={() => login('driver')}>
            <Car size={20} />
            Continue as Demo Driver
          </button>
          <button onClick={() => login('family')}>
            <Users size={20} />
            Continue as Demo Family Account
          </button>
          <button onClick={() => login('attorney')}>
            <BriefcaseBusiness size={20} />
            Continue as Demo Attorney
          </button>
        </div>
        <div className="form-grid">
          {[
            ['name', 'Name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['region', 'Region'],
            ['accountType', 'Account type'],
            ['plan', 'Plan'],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              />
            </label>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function DriverDashboard() {
  const navigate = useNavigate();
  const [data, refresh] = useStoredState(() => ({
    journeys: store.getJourneys(),
    incidents: store.getIncidents(),
    offers: store.getOffers(),
  }));

  const beginJourney = () => {
    startJourney();
    navigate('/journey');
  };

  const launchEmergency = (type) => {
    createEmergencyIncident(type);
    navigate('/active');
  };

  const stats = [
    [Car, 'Protected Journeys', 48, '+4 this week'],
    [Shield, 'Safety Runs', 46, 'Calm completions'],
    [Siren, 'Stops Logged', 2, 'Records secured'],
    [PhoneCall, 'Attorney Calls', 1, 'Initial consultation'],
    [FileCheck2, 'Incidents Saved', 3, 'Packets preserved'],
    [AlertTriangle, 'Open Incidents', 1, 'Needs follow-up'],
  ];

  return (
    <LayoutPage
      eyebrow="Law Call"
      title="Protection Ready"
      subtitle="Free driver access. Start a protected journey or activate Law Call Active in one tap."
      action={<Badge tone="cyan" icon={BadgeCheck}>Plan: Free Driver</Badge>}
    >
      <SponsorStrip />
      <GlassCard className="dashboard-hero">
        <div>
          <Badge tone="blue" icon={BluetoothConnected}>
            Auto-start ready
          </Badge>
          <h2>Start a Protected Journey</h2>
          <p>
            Activate Journey Mode before you drive. If something happens, Law Call is ready in one
            tap with location capture, trusted-contact alerts, and participating attorney routing.
          </p>
          <div className="button-row">
            <PrimaryButton onClick={beginJourney} icon={Car}>
              Start Journey
            </PrimaryButton>
            <DangerButton onClick={() => launchEmergency('Traffic Stop')}>I'm Being Stopped</DangerButton>
          </div>
        </div>
        <div className="protection-ring">
          <span>Your Journey Is Now Protected.</span>
          <Shield size={70} />
        </div>
      </GlassCard>

      <div className="quick-actions">
        <button onClick={() => launchEmergency('Accident Help')}>
          <AlertTriangle size={19} />
          Accident Help
        </button>
        <button
          onClick={() => {
            createEmergencyIncident('Ticket Upload');
            addIncidentDocument('Ticket / Citation');
            refresh();
            navigate('/packet');
          }}
        >
          <Upload size={19} />
          Upload Ticket
        </button>
        <button
          onClick={() => {
            connectAttorney();
            navigate('/attorney-connected');
          }}
        >
          <PhoneCall size={19} />
          Call Attorney
        </button>
        <button>
          <MapPin size={19} />
          Share Location
        </button>
      </div>

      <div className="stats-grid">
        {stats.map(([Icon, label, value, detail]) => (
          <StatCard key={label} icon={Icon} label={label} value={value} detail={detail} />
        ))}
      </div>

      {data.offers.length > 0 && <RepresentationOfferCard offer={data.offers[0]} onUpdate={refresh} />}

      <div className="two-column">
        <GlassCard>
          <Badge tone="blue" icon={Gauge}>
            Your Law Call Summary
          </Badge>
          <div className="summary-list">
            <strong>342 mi protected this month</strong>
            <strong>21.5 hours protected</strong>
            <strong>Last Safety Run completed yesterday</strong>
            <strong>1 open incident needs follow-up</strong>
          </div>
        </GlassCard>
        <GlassCard>
          <Badge tone="cyan" icon={PhoneCall}>
            Included Initial Consultation
          </Badge>
          <p>{consultationCopy}</p>
        </GlassCard>
      </div>

      <div className="two-column">
        <ActivityList
          title="Recent Journeys"
          items={[
            ['Safety Run', '22 min', 'No incident'],
            ['Safety Run', '38 min', 'No incident'],
            ['Police Stop Logged', 'Attorney connected', 'Packet saved'],
            ['Ticket Uploaded', 'Follow-up needed', 'Offer eligible'],
            ...data.journeys.slice(0, 2).map((journey) => [
              'Safety Run',
              journey.duration,
              journey.status === 'safety_run' ? 'No incident' : 'Incident run',
            ]),
          ]}
        />
        <ActivityList
          title="Recent Incidents"
          items={[
            ['Traffic Stop', 'Open', 'Initial consultation requested'],
            ['Accident Help', 'Resolved', 'Packet saved'],
            ['Ticket Upload', 'Follow-up needed', 'Offer eligible'],
            ...data.incidents.slice(0, 2).map((incident) => [
              incident.type,
              incident.status,
              incident.transactionStatus || incident.consultationStatus,
            ]),
          ]}
        />
      </div>
    </LayoutPage>
  );
}

function ActivityList({ title, items }) {
  return (
    <GlassCard>
      <h3>{title}</h3>
      <div className="activity-list">
        {items.map(([name, meta, detail], index) => (
          <div className="activity-item" key={`${name}-${index}`}>
            <span>
              <strong>{name}</strong>
              <small>{detail}</small>
            </span>
            <Badge tone={String(meta).toLowerCase().includes('open') ? 'red' : 'blue'}>{meta}</Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function JourneyMode() {
  const navigate = useNavigate();
  const [complete, setComplete] = useState(null);
  const [journey, setJourney] = useState(store.getActiveJourney());

  useEffect(() => {
    if (!journey) {
      setJourney(startJourney());
    }
  }, [journey]);

  const endJourney = () => {
    setComplete(completeSafetyRun());
  };

  if (complete) {
    return (
      <div className="journey-screen complete-screen">
        <GlassCard className="journey-complete-card">
          <Badge tone="cyan" icon={Check}>
            Safety Run Complete.
          </Badge>
          <h1>Safety Run Complete.</h1>
          <p>Your journey was protected. No incident recorded.</p>
          <div className="status-grid">
            <StatusTile label="Journey duration" value={complete.duration} icon={Clock3} />
            <StatusTile label="Distance protected" value={complete.distance} icon={MapPin} />
            <StatusTile label="Recording" value="No" icon={Radio} />
            <StatusTile label="Attorney used" value="No" icon={BriefcaseBusiness} />
            <StatusTile label="Trusted alert" value="No" icon={Bell} />
            <StatusTile label="Incident status" value="None" icon={FileCheck2} />
          </div>
          <PrimaryButton to="/dashboard" icon={Gauge}>
            Back to Dashboard
          </PrimaryButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="journey-screen">
      <GlassCard className="journey-command">
        <Badge tone="cyan" icon={Shield}>
          Journey Mode: Active
        </Badge>
        <h1>Your Journey Is Now Protected.</h1>
        <p>
          Law Call is armed and ready if you need help. No recording has started. No attorney has
          been called. Emergency support is one tap away.
        </p>
        <div className="status-grid">
          <StatusTile label="Journey Mode" value="Active" icon={Car} />
          <StatusTile label="Recording" value="Off" icon={Radio} />
          <StatusTile label="Location" value="Ready" icon={LocateFixed} />
          <StatusTile label="Attorney Routing" value="Ready" icon={BriefcaseBusiness} />
          <StatusTile label="Trusted Contacts" value="Ready" icon={Users} />
          <StatusTile label="Driver Access" value="$0" icon={CircleDollarSign} />
        </div>
        <div className="journey-actions">
          <DangerButton
            onClick={() => {
              createEmergencyIncident('Traffic Stop');
              navigate('/active');
            }}
          >
            I'm Being Stopped
          </DangerButton>
          <SecondaryButton
            onClick={() => {
              createEmergencyIncident('Accident Help');
              navigate('/active');
            }}
            icon={AlertTriangle}
          >
            Accident Help
          </SecondaryButton>
          <SecondaryButton
            onClick={() => {
              connectAttorney();
              navigate('/attorney-connected');
            }}
            icon={PhoneCall}
          >
            Call Attorney
          </SecondaryButton>
          <SecondaryButton icon={MapPin}>Share My Location</SecondaryButton>
          <SecondaryButton onClick={endJourney} icon={Check}>
            End Journey
          </SecondaryButton>
        </div>
      </GlassCard>
    </div>
  );
}

function StatusTile({ label, value, icon: Icon }) {
  return (
    <div className="status-tile">
      <Icon size={19} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LawCallActive() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(1);

  useEffect(() => {
    const incident = store.getActiveIncident() || createEmergencyIncident();
    saveIncidentPatch({ ...incident, recordingStatus: 'Active / Saved' });
    const interval = setInterval(() => {
      setSteps((value) => Math.min(value + 1, 6));
    }, 650);
    return () => clearInterval(interval);
  }, []);

  const checklist = [
    'Incident record created',
    'GPS location saved',
    'Recording started',
    'Trusted contacts notified',
    'Attorney matching',
    'Attorney connected',
  ];

  return (
    <div className="emergency-screen">
      <div className="emergency-shell">
        <div className="emergency-status">
          <Badge tone="red" icon={Siren}>
            Law Call Active.
          </Badge>
          <h1>Law Call Active</h1>
          <p>Stay calm. Legal guidance is connecting. Your location and incident record are being secured.</p>
        </div>

        <GlassCard className="emergency-checklist">
          {checklist.map((item, index) => (
            <div key={item} className={index < steps ? 'done' : ''}>
              <span>{index < steps ? <Check size={18} /> : index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </GlassCard>

        <GlassCard className="calm-mode">
          <h2>Calm Mode</h2>
          <ul>
            <li>Pull over safely.</li>
            <li>Keep your hands visible.</li>
            <li>Stay calm and respectful.</li>
            <li>Provide required documents when asked.</li>
            <li>Do not argue roadside.</li>
            <li>Follow lawful instructions.</li>
            <li>Laws vary by jurisdiction.</li>
          </ul>
          <p>
            Law Call provides access to participating attorneys for legal guidance in future live
            versions. This prototype is not legal advice.
          </p>
        </GlassCard>

        <div className="emergency-actions">
          <PrimaryButton
            onClick={() => {
              connectAttorney();
              navigate('/attorney-connected');
            }}
            icon={PhoneCall}
          >
            Continue to Attorney
          </PrimaryButton>
          <SecondaryButton
            onClick={() => {
              connectAttorney();
              navigate('/packet');
            }}
            icon={FileCheck2}
          >
            Create Incident Packet
          </SecondaryButton>
          <SecondaryButton to="/dashboard" icon={X}>
            Cancel Emergency Demo
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function AttorneyConnected() {
  const navigate = useNavigate();
  const [callActive, setCallActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    connectAttorney();
  }, []);

  useEffect(() => {
    if (!callActive) return undefined;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <LayoutPage
      eyebrow="Attorney Connected"
      title={callEnded ? 'Call Ended. Incident Packet Ready.' : 'Participating Attorney Matched'}
      subtitle="Your membership experience includes this initial consultation where available. Follow-up legal work may require a separate agreement with the attorney."
    >
      <div className="two-column attorney-connected-layout">
        <AttorneyCard />
        <GlassCard className="consultation-card">
          <Badge tone="cyan" icon={BadgeCheck}>
            Initial Consultation Included
          </Badge>
          <h3>Your membership includes this initial consultation.</h3>
          <p>Follow-up legal work may require a separate agreement with the attorney.</p>
          {!callActive && !callEnded && (
            <div className="button-stack">
              <PrimaryButton onClick={() => setCallActive(true)} icon={PhoneCall}>
                Start Secure Call
              </PrimaryButton>
              <SecondaryButton icon={MessageSquareText}>Message Attorney</SecondaryButton>
              <SecondaryButton to="/packet" icon={FileCheck2}>
                Create Incident Packet
              </SecondaryButton>
            </div>
          )}
          {callActive && (
            <MockCallInterface
              timer={timer}
              onEnd={() => {
                setCallActive(false);
                setCallEnded(true);
                saveIncidentPatch({ consultationStatus: 'Completed' });
              }}
            />
          )}
          {callEnded && (
            <PrimaryButton to="/packet" icon={FileCheck2}>
              View Incident Packet
            </PrimaryButton>
          )}
        </GlassCard>
      </div>
    </LayoutPage>
  );
}

function AttorneyCard() {
  return (
    <GlassCard className="attorney-card">
      <div className="attorney-avatar">SM</div>
      <div>
        <Badge tone="green" icon={BadgeCheck}>
          Available Now
        </Badge>
        <h2>{demoAttorney.name}</h2>
        <p>{demoAttorney.title}</p>
        <strong>{demoAttorney.firm}</strong>
      </div>
      <div className="attorney-details">
        <span>
          <MapPin size={16} /> {demoAttorney.jurisdiction}
        </span>
        <span>
          <BriefcaseBusiness size={16} /> {demoAttorney.practiceAreas.join(', ')}
        </span>
        <span>
          <MessageSquareText size={16} /> {demoAttorney.languages.join(', ')}
        </span>
      </div>
    </GlassCard>
  );
}

function MockCallInterface({ timer, onEnd }) {
  return (
    <div className="call-interface">
      <div className="call-pulse">
        <PhoneCall size={30} />
      </div>
      <h3>Attorney connected</h3>
      <strong>{timer}</strong>
      <div className="call-stats">
        <Badge tone="red" icon={Radio}>
          Recording active
        </Badge>
        <Badge tone="blue" icon={MapPin}>
          Location shared
        </Badge>
      </div>
      <DangerButton onClick={onEnd} icon={X}>
        End Call
      </DangerButton>
    </div>
  );
}

function IncidentPacket() {
  const [incident, setIncident] = useState(store.getActiveIncident() || store.getIncidents()[0] || createEmergencyIncident());
  const offers = store.getOffers().filter((offer) => offer.incidentId === incident.id);

  const upload = (name) => {
    setIncident(addIncidentDocument(name));
  };

  const markResolved = () => {
    setIncident(saveIncidentPatch({ status: 'resolved', followUpNeeded: false }));
  };

  return (
    <LayoutPage
      eyebrow="Incident Packet Created"
      title="Incident Packet Created"
      subtitle="Your stop has been documented and saved to your Law Call dashboard."
      action={<Badge tone={incident.status === 'resolved' ? 'green' : 'red'}>{incident.status}</Badge>}
    >
      <div className="packet-hero">
        <GlassCard className="packet-summary">
          <Badge tone="cyan" icon={FileCheck2}>
            Premium legal dossier
          </Badge>
          <h2>{incident.type}</h2>
          <div className="packet-grid">
            <PacketField label="Status" value={incident.status} />
            <PacketField label="Date/time" value={formatDate(incident.createdAt)} />
            <PacketField label="Journey ID" value={incident.journeyId} />
            <PacketField label="Location" value={incident.location} />
            <PacketField label="GPS coordinates" value={incident.gps} />
            <PacketField label="Attorney connected" value={incident.attorneyConnected ? 'Yes' : 'Pending'} />
            <PacketField label="Trusted contacts notified" value={incident.trustedContactsNotified ? 'Yes' : 'No'} />
            <PacketField label="Recording status" value={incident.recordingStatus} />
          </div>
        </GlassCard>
        <AttorneyCard />
      </div>

      {offers.length > 0 && <RepresentationOfferCard offer={offers[0]} onUpdate={() => setIncident(store.getActiveIncident())} />}

      <div className="two-column">
        <GlassCard>
          <h3>Timeline</h3>
          <div className="timeline">
            {[
              'Journey started',
              'Law Call activated',
              'Location saved',
              'Trusted contacts notified',
              'Attorney connected',
              'Packet created',
            ].map((item) => (
              <div key={item}>
                <span />
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Recording</h3>
          <div className="recording-placeholder">
            <Radio size={28} />
            <strong>Recording saved to secure incident record.</strong>
            <small>Recording laws vary by jurisdiction.</small>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="card-header-row">
          <h3>Documents</h3>
          <Badge tone="blue">{incident.documents.length} uploaded</Badge>
        </div>
        <div className="document-actions">
          {['Ticket / Citation', 'Driver License', 'Insurance', 'Notes'].map((doc) => (
            <button key={doc} onClick={() => upload(doc)}>
              <Upload size={18} />
              Upload {doc}
            </button>
          ))}
        </div>
        <div className="document-list">
          {incident.documents.length === 0 ? (
            <EmptyState text="No documents uploaded yet." />
          ) : (
            incident.documents.map((doc) => (
              <div key={doc.id}>
                <FileCheck2 size={18} />
                <span>
                  <strong>{doc.name}</strong>
                  <small>{doc.status}</small>
                </span>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <h3>Follow-up actions</h3>
        <div className="quick-actions">
          <button>
            <Contact size={18} />
            Request Attorney Follow-Up
          </button>
          <button onClick={() => upload('Ticket / Citation')}>
            <Upload size={18} />
            Upload Ticket
          </button>
          <button>
            <Users size={18} />
            Share Packet with Trusted Contact
          </button>
          <button onClick={markResolved}>
            <Check size={18} />
            Mark Resolved
          </button>
          <Link to="/dashboard">
            <Gauge size={18} />
            Back to Dashboard
          </Link>
        </div>
      </GlassCard>
    </LayoutPage>
  );
}

function PacketField({ label, value }) {
  return (
    <div className="packet-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <Shield size={22} />
      <span>{text}</span>
    </div>
  );
}

function FamilyDashboard() {
  const [members, setMembers] = useState(store.getFamily());
  const [modal, setModal] = useState(false);

  const addMember = (member) => {
    const updated = [{ id: `family-${Date.now()}`, ...member }, ...members];
    store.setFamily(updated);
    setMembers(updated);
    setModal(false);
  };

  return (
    <LayoutPage
      eyebrow="Family Protection"
      title="Family Protection"
      subtitle="Protect the drivers your family worries about most with journey alerts, packet sharing, and calm emergency flow."
      action={
        <PrimaryButton onClick={() => setModal(true)} icon={Plus}>
          Add Protected Driver
        </PrimaryButton>
      }
    >
      <SponsorStrip />
      <div className="stats-grid">
        <StatCard icon={Users} label="Family Drivers Protected" value={members.length} />
        <StatCard icon={Car} label="Protected Journeys" value="126" />
        <StatCard icon={Shield} label="Safety Runs" value="121" />
        <StatCard icon={Siren} label="Stops Logged" value="3" />
        <StatCard icon={AlertTriangle} label="Open Incidents" value="1" tone="danger" />
      </div>
      <div className="family-grid">
        {members.map((member) => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}
      </div>
      <ActivityList
        title="Family Alerts"
        items={[
          ['Alex completed a Safety Run.', 'Today', 'No incident'],
          ['Margaret Journey Mode activated.', 'Yesterday', 'Auto-start via Bluetooth'],
          ['Sara created an Incident Packet.', '2 days', 'Shared with trusted contact'],
          ['Omar completed a protected journey.', 'Today', 'No unresolved incidents'],
        ]}
      />
      {modal && <AddFamilyModal onClose={() => setModal(false)} onSave={addMember} />}
    </LayoutPage>
  );
}

function FamilyMemberCard({ member }) {
  return (
    <GlassCard className="family-card">
      <div className="family-avatar">{member.name.slice(0, 1)}</div>
      <h3>{member.name}</h3>
      <Badge tone="blue">{member.role}</Badge>
      <div className="family-stats">
        <span>{member.journeys} protected journeys</span>
        <span>{member.safetyRuns} safety runs</span>
        <span>{member.incidents} stops logged</span>
        <span>Last journey: {member.lastJourney}</span>
      </div>
    </GlassCard>
  );
}

function AddFamilyModal({ onClose, onSave }) {
  const [member, setMember] = useState({
    name: '',
    role: 'Protected Driver',
    journeys: 0,
    safetyRuns: 0,
    incidents: 0,
    lastJourney: 'Not yet',
  });

  return (
    <div className="modal-backdrop">
      <GlassCard className="modal-card">
        <div className="card-header-row">
          <h3>Add Protected Driver</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <label>
          Name
          <input value={member.name} onChange={(event) => setMember({ ...member, name: event.target.value })} />
        </label>
        <label>
          Relationship
          <input value={member.role} onChange={(event) => setMember({ ...member, role: event.target.value })} />
        </label>
        <PrimaryButton onClick={() => onSave(member)} icon={Plus}>
          Add Driver
        </PrimaryButton>
      </GlassCard>
    </div>
  );
}

function AttorneyDashboard() {
  const [available, setAvailable] = useState(store.getAttorneyAvailable());
  const [offerOpen, setOfferOpen] = useState(false);

  const toggle = () => {
    store.setAttorneyAvailable(!available);
    setAvailable(!available);
  };

  return (
    <LayoutPage
      eyebrow="Attorney Network"
      title="Attorney Network Dashboard"
      subtitle="Receive high-intent roadside legal consultation requests and convert qualified incidents into paid follow-up representation where appropriate."
      action={
        <button className={`availability-toggle ${available ? 'is-on' : ''}`} onClick={toggle}>
          <span />
          {available ? 'Available' : 'Unavailable'}
        </button>
      }
    >
      <SponsorStrip />
      <GlassCard className="attorney-value">
        <Badge tone="purple" icon={Handshake}>
          Attorney-side value
        </Badge>
        <h2>Law Call delivers high-intent roadside legal consultation requests.</h2>
        <p>
          Participating attorneys can provide an included initial consultation and convert
          qualified incidents into paid follow-up representation where appropriate.
        </p>
      </GlassCard>

      <div className="two-column">
        <AttorneyCard />
        <GlassCard>
          <h3>Profile</h3>
          <div className="summary-list">
            <strong>Mitchell Roadside Legal Group</strong>
            <strong>California</strong>
            <strong>Traffic, DUI, Accident, Criminal Defense</strong>
            <strong>English, Spanish</strong>
            <strong>Verified</strong>
          </div>
        </GlassCard>
      </div>

      <div className="stats-grid">
        <StatCard icon={PhoneCall} label="Calls accepted" value="28" />
        <StatCard icon={Handshake} label="Follow-up leads" value="14" />
        <StatCard icon={Clock3} label="Avg response time" value="42 sec" />
        <StatCard icon={CircleDollarSign} label="Monthly demo revenue" value="$2,850" />
      </div>

      <GlassCard>
        <div className="card-header-row">
          <h3>Consultation Requests</h3>
          <PrimaryButton onClick={() => setOfferOpen(true)} icon={FilePenLine}>
            Send Representation Offer
          </PrimaryButton>
        </div>
        <div className="request-list">
          {demoRequests.map((request) => (
            <div className="request-card" key={request.id}>
              <div>
                <Badge tone={request.status === 'urgent' ? 'red' : 'blue'}>{request.status}</Badge>
                <h3>{request.type}</h3>
                <p>{request.distance}</p>
              </div>
              <div className="request-meta">
                <span>Jurisdiction: {request.jurisdiction}</span>
                <span>Initial consultation status: {request.consultationStatus}</span>
                <span>Potential case value: {request.potentialCaseValue}</span>
                <span>Incident Packet available: {request.packet ? 'Yes' : 'No'}</span>
                <span>User requested representation: {request.representationRequested ? 'Yes' : 'No'}</span>
              </div>
              <div className="request-actions">
                <SecondaryButton icon={PhoneCall}>Accept Call</SecondaryButton>
                <SecondaryButton icon={X}>Decline</SecondaryButton>
                <SecondaryButton to="/packet" icon={FileCheck2}>
                  View Packet
                </SecondaryButton>
                <SecondaryButton onClick={() => setOfferOpen(true)} icon={FilePenLine}>
                  Send Offer
                </SecondaryButton>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
      {offerOpen && <RepresentationOfferModal onClose={() => setOfferOpen(false)} />}
    </LayoutPage>
  );
}

function RepresentationOfferModal({ onClose }) {
  const [form, setForm] = useState({
    matterType: 'Traffic citation defense',
    feeType: 'flat fee',
    amount: '$750',
    scope: 'Review citation, advise client, prepare representation strategy, and appear for one traffic court setting.',
    terms: 'Client may accept or decline. Scope and fee are subject to attorney-client agreement.',
    agreementName: 'Representation Agreement Placeholder.pdf',
  });

  const submit = () => {
    sendRepresentationOffer(form);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <GlassCard className="modal-card wide-modal">
        <div className="card-header-row">
          <h3>Send Representation Offer</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          <label>
            Matter type
            <input value={form.matterType} onChange={(event) => setForm({ ...form, matterType: event.target.value })} />
          </label>
          <label>
            Fee type
            <select value={form.feeType} onChange={(event) => setForm({ ...form, feeType: event.target.value })}>
              <option>flat fee</option>
              <option>retainer</option>
              <option>hourly</option>
            </select>
          </label>
          <label>
            Amount
            <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          </label>
          <label>
            Upload agreement placeholder
            <input value={form.agreementName} onChange={(event) => setForm({ ...form, agreementName: event.target.value })} />
          </label>
        </div>
        <label>
          Scope of representation
          <textarea value={form.scope} onChange={(event) => setForm({ ...form, scope: event.target.value })} />
        </label>
        <label>
          Terms
          <textarea value={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.value })} />
        </label>
        <PrimaryButton onClick={submit} icon={FilePenLine}>
          Send to User
        </PrimaryButton>
      </GlassCard>
    </div>
  );
}

function RepresentationOfferCard({ offer, onUpdate }) {
  const [status, setStatus] = useState(offer.transactionStatus || offer.status);

  const updateStatus = (nextStatus) => {
    const offers = store.getOffers().map((item) =>
      item.id === offer.id
        ? {
            ...item,
            agreementStatus: nextStatus === 'Agreement signed' ? 'Signed' : 'Viewed',
            transactionStatus: nextStatus,
          }
        : item,
    );
    store.setOffers(offers);
    saveIncidentPatch({ transactionStatus: nextStatus });
    setStatus(nextStatus);
    onUpdate?.();
  };

  return (
    <GlassCard className="representation-offer">
      <Badge tone="purple" icon={FilePenLine}>
        Attorney Representation Offer
      </Badge>
      <div className="offer-grid">
        <PacketField label="Attorney name" value={offer.attorneyName} />
        <PacketField label="Matter type" value={offer.matterType} />
        <PacketField label="Scope" value={offer.scope} />
        <PacketField label="Fee" value={`${offer.feeType} / ${offer.amount}`} />
        <PacketField label="Agreement status" value={status} />
      </div>
      <div className="button-row">
        <SecondaryButton onClick={() => updateStatus('Agreement viewed')} icon={FileCheck2}>
          View Agreement
        </SecondaryButton>
        <SecondaryButton onClick={() => updateStatus('Agreement signed')} icon={FilePenLine}>
          E-sign
        </SecondaryButton>
        <PrimaryButton onClick={() => updateStatus('Payment completed')} icon={CircleDollarSign}>
          Pay
        </PrimaryButton>
      </div>
      <p>E-signature and payment are simulated for this MVP.</p>
    </GlassCard>
  );
}

function PricingPage() {
  return (
    <LayoutPage
      eyebrow="Pricing"
      title="Attorney-funded growth model"
      subtitle="Drivers use Law Call for free. Revenue comes from attorney listings, local coverage, lead tools, and sponsor-safe placements."
    >
      <SponsorStrip />
      <GlassCard className="driver-free-card">
        <Badge tone="green" icon={Shield}>
          Drivers
        </Badge>
        <div>
          <h2>$0</h2>
          <p>{consumerPromise}</p>
        </div>
        <ul>
          <li>Journey Mode</li>
          <li>Law Call Active</li>
          <li>Incident Packet</li>
          <li>Trusted-contact alerts</li>
          <li>Attorney discovery</li>
          <li>Initial consultation with participating attorneys where available</li>
        </ul>
      </GlassCard>

      <div className="pricing-grid">
        {attorneyPlans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
      <LegalDisclaimer compact />
    </LayoutPage>
  );
}

function PricingCard({ plan }) {
  return (
    <GlassCard className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
      {plan.featured && <Badge tone="red" icon={Zap}>Best local start</Badge>}
      <h3>{plan.name}</h3>
      <div className="price-line">
        <strong>{plan.price}</strong>
        <span>{plan.cadence}</span>
      </div>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <Check size={16} />
            {feature}
          </li>
        ))}
      </ul>
      <PrimaryButton icon={ChevronRight}>Choose Plan</PrimaryButton>
    </GlassCard>
  );
}

function AccountSettings() {
  const [user, setUser] = useState(store.getUser() || createDemoUser('driver'));

  const update = (patch) => {
    const updated = { ...user, ...patch };
    store.setUser(updated);
    setUser(updated);
  };

  const addContact = () => {
    update({
      trustedContacts: [
        ...user.trustedContacts,
        {
          id: `contact-${Date.now()}`,
          name: 'New Contact',
          relationship: 'Trusted Contact',
          phone: '(555) 000-0000',
          email: 'contact@example.com',
          notify: true,
          sharePacket: false,
        },
      ],
    });
  };

  return (
    <LayoutPage
      eyebrow="Account"
      title="Settings"
      subtitle="Configure the profile, Bluetooth auto-start, trusted contacts, vehicle vault, documents, privacy, and legal notices."
    >
      <div className="settings-grid">
        <GlassCard>
          <h3>Profile</h3>
          <div className="form-grid">
            <label>
              Name
              <input value={user.name} onChange={(event) => update({ name: event.target.value })} />
            </label>
            <label>
              Email
              <input value={user.email} onChange={(event) => update({ email: event.target.value })} />
            </label>
            <label>
              Phone
              <input value={user.phone} onChange={(event) => update({ phone: event.target.value })} />
            </label>
            <label>
              Region
              <input value={user.region} onChange={(event) => update({ region: event.target.value })} />
            </label>
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Auto-Start Journey Mode</h3>
          <div className="bluetooth-panel">
            <BluetoothConnected size={28} />
            <div>
              <strong>Start Law Call when my phone connects to my car.</strong>
              <span>Your Journey Is Now Protected notification enabled.</span>
            </div>
            <button
              className={`availability-toggle ${user.autoStartBluetooth ? 'is-on' : ''}`}
              onClick={() => update({ autoStartBluetooth: !user.autoStartBluetooth })}
            >
              <span />
              {user.autoStartBluetooth ? 'On' : 'Off'}
            </button>
          </div>
          <label>
            Car Bluetooth connection
            <input
              value={user.carBluetoothName}
              onChange={(event) => update({ carBluetoothName: event.target.value })}
            />
          </label>
        </GlassCard>

        <GlassCard>
          <div className="card-header-row">
            <h3>Trusted Contacts</h3>
            <SecondaryButton onClick={addContact} icon={Plus}>
              Add Contact
            </SecondaryButton>
          </div>
          <div className="settings-list">
            {user.trustedContacts.map((contact) => (
              <div key={contact.id}>
                <Contact size={18} />
                <span>
                  <strong>{contact.name}</strong>
                  <small>
                    {contact.relationship} / notify during incidents: {contact.notify ? 'Yes' : 'No'} / share packet:{' '}
                    {contact.sharePacket ? 'Yes' : 'No'}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Vehicles</h3>
          <div className="settings-list">
            {user.vehicles.map((vehicle) => (
              <div key={vehicle.id}>
                <Car size={18} />
                <span>
                  <strong>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </strong>
                  <small>
                    Plate {vehicle.plate} / {vehicle.color} / Law Call decal: {vehicle.decal}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Document Vault</h3>
          <div className="settings-list">
            {user.documents.map((doc) => (
              <div key={doc.id}>
                <FileCheck2 size={18} />
                <span>
                  <strong>{doc.name}</strong>
                  <small>{doc.status}</small>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3>Notifications / Privacy</h3>
          <div className="summary-list">
            <strong>Journey Mode alerts enabled</strong>
            <strong>Trusted-contact incident alerts enabled</strong>
            <strong>Packet sharing requires user action</strong>
            <strong>Sponsors hidden during Law Call Active</strong>
          </div>
        </GlassCard>
      </div>
      <LegalDisclaimer />
    </LayoutPage>
  );
}

export default App;
