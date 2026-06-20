import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PACKAGES = [
  {
    id: 'gurugram-gyms',
    name: 'Gurugram Gyms',
    badge: 'ACTIVE',
    badgeColor: '#22c55e',
    category: 'Health & Wellness',
    tagline: 'Premium fitness centres across Gurugram',
    description: 'Target health-conscious, high-income gym-goers across top fitness centres in Gurugram. Ideal for supplements, sportswear, F&B and wellness brands.',
    price: '₹35,000',
    priceUnit: '/ month',
    screens: 28,
    impressions: '1.2M',
    reach: '45K unique visitors/month',
    locations: [
      { name: 'Cult.fit Sector 56', lat: 28.4145, lng: 77.0927, screens: 3 },
      { name: "Gold's Gym DLF", lat: 28.4921, lng: 77.0895, screens: 4 },
      { name: 'Anytime Fitness Cyber City', lat: 28.4949, lng: 77.0877, screens: 2 },
      { name: 'Snap Fitness Sohna Road', lat: 28.4253, lng: 77.0478, screens: 3 },
      { name: 'Gym Nation MG Road', lat: 28.4799, lng: 77.0918, screens: 4 },
      { name: 'F45 Training Golf Course Rd', lat: 28.4384, lng: 77.1017, screens: 2 },
      { name: 'Crossfit Sector 14', lat: 28.4673, lng: 77.0254, screens: 3 },
    ],
    center: [28.4595, 77.0600],
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  {
    id: 'gurugram-offices',
    name: 'Gurugram Offices',
    badge: 'STRATEGIC',
    badgeColor: '#3b82f6',
    category: 'Corporate & B2B',
    tagline: 'Fortune 500 lobbies & corporate parks',
    description: "Capture the attention of working professionals and decision-makers inside Gurugram's top IT parks, corporate lobbies and co-working hubs.",
    price: '₹55,000',
    priceUnit: '/ month',
    screens: 42,
    impressions: '2.1M',
    reach: '80K unique visitors/month',
    locations: [
      { name: 'DLF Cyber City', lat: 28.4945, lng: 77.0882, screens: 8 },
      { name: 'Unitech Cyber Park', lat: 28.4763, lng: 77.0864, screens: 5 },
      { name: 'Vatika Business Park', lat: 28.4354, lng: 77.0494, screens: 4 },
      { name: 'Candor TechSpace', lat: 28.5013, lng: 77.0774, screens: 6 },
      { name: 'Spaze IT Park Sec 49', lat: 28.4122, lng: 77.0328, screens: 4 },
      { name: 'Global Foyer Golf Course Rd', lat: 28.4412, lng: 77.1028, screens: 5 },
      { name: 'WeWork Sector 44', lat: 28.4564, lng: 77.0725, screens: 3 },
    ],
    center: [28.4700, 77.0800],
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    id: 'noida-arena',
    name: 'Noida Arena',
    badge: 'EXPANDING',
    badgeColor: '#a855f7',
    category: 'Retail & Lifestyle',
    tagline: 'High-footfall malls & sector hubs',
    description: 'Reach the young, digitally-native audience of Noida across premium malls, cafes, and sector hubs. Perfect for D2C brands, F&B, fashion and EdTech.',
    price: '₹28,000',
    priceUnit: '/ month',
    screens: 34,
    impressions: '1.6M',
    reach: '60K unique visitors/month',
    locations: [
      { name: 'DLF Mall of India', lat: 28.5693, lng: 77.3213, screens: 6 },
      { name: 'The Great India Place', lat: 28.5726, lng: 77.3265, screens: 5 },
      { name: 'Sector 18 Market', lat: 28.5699, lng: 77.3261, screens: 4 },
      { name: 'Atta Market Sector 27', lat: 28.5797, lng: 77.3254, screens: 3 },
      { name: 'Logix City Centre', lat: 28.5943, lng: 77.3376, screens: 4 },
      { name: 'Wave City Mall', lat: 28.6348, lng: 77.3712, screens: 3 },
    ],
    center: [28.5850, 77.3200],
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
  },
  {
    id: 'south-delhi-premium',
    name: 'South Delhi Premium',
    badge: 'EXCLUSIVE',
    badgeColor: '#f59e0b',
    category: 'Luxury & Premium',
    tagline: 'Elite neighbourhoods & premium venues',
    description: "Access South Delhi's affluent audience in upscale markets, luxury apartments and premium dining hubs. Best fit for luxury, finance, real estate and premium F&B.",
    price: '₹65,000',
    priceUnit: '/ month',
    screens: 22,
    impressions: '0.9M',
    reach: '35K unique visitors/month',
    locations: [
      { name: 'Khan Market', lat: 28.5996, lng: 77.2314, screens: 3 },
      { name: 'Hauz Khas Village', lat: 28.5523, lng: 77.2001, screens: 3 },
      { name: 'Lajpat Nagar Market', lat: 28.5678, lng: 77.2419, screens: 2 },
      { name: 'Green Park Market', lat: 28.5565, lng: 77.2041, screens: 2 },
      { name: 'Select Citywalk Saket', lat: 28.5266, lng: 77.2169, screens: 5 },
      { name: 'DLF Promenade Vasant Kunj', lat: 28.5207, lng: 77.1571, screens: 4 },
    ],
    center: [28.5600, 77.2100],
    zoom: 12,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  },
];

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function AnimatedCounter({ target, duration = 1800 }) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const numTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(/^[\d.]+/, '');
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const cur = numTarget * eased;
          setValue(Number.isInteger(numTarget) ? Math.round(cur) : +cur.toFixed(1));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const numPart = target.replace(/[^0-9.]/g, '');
  const suffix = target.replace(/^[\d.]+/, '');
  const display = Number.isInteger(parseFloat(numPart)) ? Math.round(value) : value;

  return <span ref={ref}>{display}{suffix}</span>;
}

const createCustomIcon = (color) =>
  L.divIcon({
    html: `<div style="width:13px;height:13px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 3px ${color}55;"></div>`,
    iconSize: [13, 13],
    iconAnchor: [6, 6],
    className: '',
  });

const STATS = [
  { label: 'Total Impressions', value: '6.8M+', sub: 'across all packages', icon: '👁', color: '#2563eb' },
  { label: 'Active Screens', value: '126+', sub: 'Delhi NCR locations', icon: '📺', color: '#7c3aed' },
  { label: 'Avg. Monthly Reach', value: '220K', sub: 'unique visitors', icon: '📍', color: '#0891b2' },
  { label: 'Campaign Packages', value: '12+', sub: 'tailored zones', icon: '🗂', color: '#059669' },
];

export default function DashboardPage({ state, briefId }) {
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [showMore, setShowMore] = useState(false);

  const displayPackages = showMore ? PACKAGES : PACKAGES.slice(0, 4);

  return (
    <div className="min-h-screen w-full animate-fadeIn bg-slate-50/60">

      {/* ── Stats Bar ── */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-slate-200">
            {STATS.map((stat) => (
              <div key={stat.label} className="sm:px-8 first:pl-0 last:pr-0 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: stat.color + '18' }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: stat.color }}>
                    {stat.label}
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 leading-none">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16">

        {/* Welcome */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Your Campaign Dashboard</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
              {state?.brand?.name || 'Advertiser'}
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Brief <span className="font-bold text-slate-700">{briefId}</span> submitted · Click a package below to explore details and book.
          </p>
        </div>

        {/* ── Package Cards Grid ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Campaign Packages</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a zone to see screen locations and pricing</p>
            </div>
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {showMore ? 'Show less' : 'View all packages →'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayPackages.map((pkg) => {
              const isActive = selectedPackage?.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'border-blue-600 shadow-xl shadow-blue-500/15 scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-lg bg-white'
                  }`}
                  style={{ background: isActive ? 'linear-gradient(135deg,#eff6ff,#f0f9ff)' : '' }}
                >
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full text-white uppercase tracking-wider"
                      style={{ background: pkg.badgeColor }}
                    >
                      {pkg.badge}
                    </span>
                    {isActive && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 3.5 7 9 1" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{pkg.name}</h4>
                        <p className="text-[11px] text-slate-500">{pkg.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-sm font-extrabold text-blue-600">{pkg.price}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{pkg.priceUnit}</div>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: pkg.badgeColor + '20', color: pkg.badgeColor }}
                      >
                        {pkg.screens} screens
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail Panel (horizontal: info left, map right) ── */}
        {selectedPackage && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
            {/* Header strip */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${selectedPackage.badgeColor}18, ${selectedPackage.badgeColor}08)` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={selectedPackage.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span
                    className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full text-white uppercase tracking-wider mb-1"
                    style={{ background: selectedPackage.badgeColor }}
                  >
                    {selectedPackage.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedPackage.name}</h3>
                  <p className="text-xs text-slate-500">{selectedPackage.category}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="hidden sm:flex items-center gap-6">
                {[
                  { label: 'Screens', value: selectedPackage.screens },
                  { label: 'Impressions', value: selectedPackage.impressions },
                  { label: 'Reach / mo', value: selectedPackage.reach.split(' ')[0] },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-extrabold text-slate-900" style={{ color: selectedPackage.badgeColor }}>{s.value}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal body: info left | map right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px]">

              {/* Left: About + Price */}
              <div className="p-6 border-r border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">About This Package</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{selectedPackage.description}</p>

                {/* Location pills */}
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Included Locations ({selectedPackage.locations.length} sites)
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedPackage.locations.map((loc) => (
                    <span
                      key={loc.name}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                      style={{
                        background: selectedPackage.badgeColor + '12',
                        color: selectedPackage.badgeColor,
                        borderColor: selectedPackage.badgeColor + '30',
                      }}
                    >
                      📍 {loc.name}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border"
                  style={{
                    background: selectedPackage.badgeColor + '0d',
                    borderColor: selectedPackage.badgeColor + '30',
                  }}
                >
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Package Price</div>
                    <div className="text-3xl font-extrabold" style={{ color: selectedPackage.badgeColor }}>
                      {selectedPackage.price}
                      <span className="text-sm font-semibold text-slate-400 ml-1">{selectedPackage.priceUnit}</span>
                    </div>
                  </div>
                  <button
                    className="px-6 py-3 text-sm font-bold text-white rounded-xl cursor-pointer transition-all hover:scale-105 hover:shadow-lg shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${selectedPackage.badgeColor}, #1e40af)`,
                      boxShadow: `0 4px 14px ${selectedPackage.badgeColor}40`,
                    }}
                  >
                    Book Package →
                  </button>
                </div>
              </div>

              {/* Right: Map */}
              <div className="flex flex-col">
                <div className="px-5 pt-5 pb-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Screen Locations Map
                  </h4>
                </div>
                <div className="flex-1" style={{ minHeight: '360px' }}>
                  <MapContainer
                    center={selectedPackage.center}
                    zoom={selectedPackage.zoom}
                    style={{ height: '100%', width: '100%', minHeight: '360px' }}
                    zoomControl={true}
                    attributionControl={false}
                  >
                    <MapController center={selectedPackage.center} zoom={selectedPackage.zoom} />
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution="© CartoDB"
                    />
                    {selectedPackage.locations.map((loc) => (
                      <React.Fragment key={loc.name}>
                        <Circle
                          center={[loc.lat, loc.lng]}
                          radius={350}
                          pathOptions={{
                            color: selectedPackage.badgeColor,
                            fillColor: selectedPackage.badgeColor,
                            fillOpacity: 0.2,
                            weight: 1.5,
                          }}
                        />
                        <Marker
                          position={[loc.lat, loc.lng]}
                          icon={createCustomIcon(selectedPackage.badgeColor)}
                        >
                          <Popup>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, minWidth: 140 }}>
                              <strong style={{ fontSize: 13 }}>{loc.name}</strong>
                              <br />
                              <span style={{ color: '#64748b' }}>{loc.screens} screen{loc.screens > 1 ? 's' : ''}</span>
                            </div>
                          </Popup>
                        </Marker>
                      </React.Fragment>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
