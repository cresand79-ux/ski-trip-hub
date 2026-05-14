import React, { useMemo, useState } from 'react';
import { trips } from './data';
import './index.css';

function App() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isPassExpanded, setIsPassExpanded] = useState(false);
  const [isFlightsExpanded, setIsFlightsExpanded] = useState(true);
  const [useHalfPricePass, setUseHalfPricePass] = useState(true);
  const [reuseCard, setReuseCard] = useState(false);
  const [outboundMode, setOutboundMode] = useState('split');
  const [returnMode, setReturnMode] = useState('van');
  const [selectedTripSlug, setSelectedTripSlug] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('trip') || '';
  });

  const trip = useMemo(() => trips.find((item) => item.slug === selectedTripSlug), [selectedTripSlug]);
  const activeTrips = trips.filter((item) => item.status !== 'archived');
  const archivedTrips = trips.filter((item) => item.status === 'archived');
  const tripNotFound = selectedTripSlug && !trip;

  const passDays = 4;

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Fully booked':
        return { label: '✅ Fully Booked', style: 'bg-green-950 text-green-400 border-green-800' };
      case 'Flight pending':
        return { label: '⏳ Flight Pending', style: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'Hotel booked':
        return { label: '🏨 Hotel Booked', style: 'bg-blue-950 text-blue-400 border-blue-800' };
      default:
        return { label: '💤 TBC', style: 'bg-slate-900 text-slate-500 border-slate-700' };
    }
  };

  const openTrip = (slug) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.pathname}?trip=${encodeURIComponent(slug)}`;
    window.history.pushState({}, '', url);
    setSelectedTripSlug(slug);
  };

  const clearSelection = () => {
    if (typeof window === 'undefined') return;
    window.history.pushState({}, '', window.location.pathname);
    setSelectedTripSlug('');
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 font-sans pb-12">
        <header className="mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-blue-400">Trip Hub</h1>
          <p className="text-slate-400 max-w-2xl">
            Select a trip tile below to open its details. Each trip is stored in its own JSON file, and direct linking is supported using <span className="text-blue-300">?trip=&lt;slug&gt;</span>.
          </p>
        </header>

        {tripNotFound && (
          <div className="mb-6 rounded-2xl border border-rose-700 bg-rose-950/60 p-4 text-rose-200">
            Trip <span className="font-semibold">{selectedTripSlug}</span> was not found. Please choose one of the available trips below.
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-300">Active Trips</h2>
                <p className="text-slate-400 text-sm">Trips currently in planning or for the next season.</p>
              </div>
              <div className="text-xs text-slate-500">{activeTrips.length} active trip{activeTrips.length === 1 ? '' : 's'}</div>
            </div>
            <div className="grid gap-4">
              {activeTrips.map((item) => (
                <article key={item.slug} className="group overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-5 transition hover:border-blue-500">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Active</p>
                      <h3 className="mt-2 text-lg font-semibold text-blue-300">{item.resort} {item.year}</h3>
                      <p className="text-slate-400 text-sm">{item.dates?.start} → {item.dates?.end}</p>
                    </div>
                    <span className="rounded-full border border-green-800 bg-green-950/50 px-3 py-1 text-[11px] font-semibold text-green-300">Active</span>
                  </div>
                  <div className="mt-4 space-y-2 text-slate-300 text-sm">
                    <p>🏨 {item.accommodation?.name}</p>
                    <p>👥 {item.participants.length} participant{item.participants.length === 1 ? '' : 's'}</p>
                    <p>✈️ {item.flights?.outboundHub || 'LHR'} → {item.flights?.destinationHub || 'ZRH'}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => openTrip(item.slug)} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">
                      Open Trip
                    </button>
                    {item.accommodation?.url && (
                      <a href={item.accommodation.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-300 hover:underline">
                        Hotel website ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-300">Archived Trips</h2>
                <p className="text-slate-400 text-sm">Past trips are kept for reference and direct linking.</p>
              </div>
              <div className="text-xs text-slate-500">{archivedTrips.length} archived trip{archivedTrips.length === 1 ? '' : 's'}</div>
            </div>
            <div className="grid gap-4">
              {archivedTrips.length === 0 ? (
                <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5 text-slate-400">No archived trips yet.</div>
              ) : (
                archivedTrips.map((item) => (
                  <article key={item.slug} className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Archived</p>
                        <h3 className="mt-2 text-lg font-semibold text-blue-300">{item.resort} {item.year}</h3>
                        <p className="text-slate-400 text-sm">{item.dates?.start} → {item.dates?.end}</p>
                      </div>
                      <span className="rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold text-slate-300">Archived</span>
                    </div>
                    <div className="mt-4 space-y-2 text-slate-300 text-sm">
                      <p>🏨 {item.accommodation?.name}</p>
                      <p>👥 {item.participants.length} participant{item.participants.length === 1 ? '' : 's'}</p>
                      <p>✈️ {item.flights?.outboundHub || 'LHR'} → {item.flights?.destinationHub || 'ZRH'}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button onClick={() => openTrip(item.slug)} className="inline-flex items-center justify-center rounded-full bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-600">
                        Open Trip
                      </button>
                      {item.accommodation?.url && (
                        <a href={item.accommodation.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-300 hover:underline">
                          Hotel website ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const participants = trip.participants || [];
  const morningCommute = trip.morningCommute || Object.entries(trip.commute || {}).map(([key, item]) => {
    const name = typeof item === 'string' ? key : item.name || key;
    const dist = typeof item === 'string' ? '' : item.dist || '';
    const icon = key.toLowerCase().includes('station') ? '🚉' : '🚠';
    return { id: key, icon, name, dist };
  });

  const passInfo = trip.logistics?.passInfo || {
    title: 'Lift Pass Strategy',
    description: 'Use the resort pass option that matches the trip and buy it in advance when available.',
    passUrl: trip.logistics?.passUrl || '#',
    usePassLabel: 'Apply resort lift pass pricing',
    reuseCardLabel: 'Reuse an existing lift card when applicable',
    standardDailyRate: 0,
    passDailyRate: 0,
    passUpfront: 0,
    keycardFee: 0,
    showReuseCard: false,
    currency: trip.logistics?.currency || 'CHF',
    note: trip.logistics?.discountInfo || '',
  };

  const totalWithoutPass = passInfo.standardDailyRate * passDays + passInfo.keycardFee;
  const totalWithPass = passInfo.passUpfront + passInfo.passDailyRate * passDays + (reuseCard ? 0 : passInfo.keycardFee);
  const currentLiftTotal = useHalfPricePass ? totalWithPass : totalWithoutPass - (reuseCard ? passInfo.keycardFee : 0);
  const passSavings = totalWithoutPass - currentLiftTotal;
  const currency = passInfo.currency || 'CHF';

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans pb-12">
      <header className="mb-8 border-b border-slate-700 pb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">{trip.resort || 'Resort'} {trip.year || ''}</h1>
          <p className="text-slate-400">{trip.dates?.start} to {trip.dates?.end}</p>
        </div>
        <button onClick={clearSelection} className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-500 hover:text-white">
          ← Back to trip list
        </button>
      </header>

      <section className="bg-slate-800 rounded-xl p-6 mb-6 shadow-xl border border-slate-700 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basecamp: {trip.accommodation?.name}</h2>
          <p className="text-slate-300 mb-2 text-sm">{trip.accommodation?.address}</p>
          <span className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-700">
            {trip.accommodation?.roomType}
          </span>
        </div>
        {trip.accommodation?.url && (
          <div className="shrink-0">
            <a
              href={trip.accommodation.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md"
            >
              Visit Hotel Website ↗
            </a>
          </div>
        )}
      </section>

      <section className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
        <button
          onClick={() => setIsFlightsExpanded(!isFlightsExpanded)}
          className="w-full flex justify-between items-center p-5 font-bold text-lg text-blue-400 hover:bg-slate-700/30 transition-colors select-none"
        >
          <span>✈️ Flight Matrix & Transfer Strategies</span>
          <span className="text-slate-400 text-sm font-mono">{isFlightsExpanded ? '[ HIDE ]' : '[ SHOW ]'}</span>
        </button>

        {isFlightsExpanded && (
          <div className="p-5 pt-0 border-t border-slate-700/50 bg-slate-800/40 space-y-6">
            {trip.flights?.waves && trip.flights.waves.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {trip.flights.waves.map((wave, index) => (
                  <div key={wave.id || index} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-blue-300 mb-2">{wave.title}</h4>
                      <div className="text-xs space-y-1 text-slate-400 font-mono">
                        <p>🛫 Out: {wave.outbound}</p>
                        <p>🛬 Ret: {wave.return}</p>
                      </div>
                    </div>
                    <p className="text-xs italic text-slate-500 mt-3 border-t border-slate-800 pt-2">{wave.transferNote}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/40">
                <h4 className="text-sm font-bold text-slate-300 mb-3">Wednesday Outbound Strategy</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 text-xs text-slate-400 cursor-pointer">
                    <input type="radio" name="outbound" checked={outboundMode === 'split'} onChange={() => setOutboundMode('split')} className="text-blue-500 focus:ring-0 bg-slate-800" />
                    <span>Split Team (Early/Mid on Train + Late Wave Private Minibus)</span>
                  </label>
                  <label className="flex items-center space-x-3 text-xs text-slate-400 cursor-pointer">
                    <input type="radio" name="outbound" checked={outboundMode === 'all-van'} onChange={() => setOutboundMode('all-van')} className="text-blue-500 focus:ring-0 bg-slate-800" />
                    <span>Consolidated Vans (Coordinate times through Triptransfer / Comfort-Taxi)</span>
                  </label>
                </div>
                {outboundMode === 'split' && (
                  <div className="mt-3 p-2 bg-blue-950/30 border border-blue-900/50 rounded text-xs text-slate-400">
                    🌙 **Late Wave Minibus:** 22:00 ZRH pickup gets us to hotel room doorsteps by **23:30**. Cost framework based on Triptransfer.ch quotes (~549 CHF return per van).
                  </div>
                )}
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/40 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-3">Sunday Return Strategy</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 text-xs text-slate-400 cursor-pointer">
                      <input type="radio" name="return" checked={returnMode === 'van'} onChange={() => setReturnMode('van')} className="text-blue-500 focus:ring-0 bg-slate-800" />
                      <span>🚀 Unified Private Van (Highly Recommended)</span>
                    </label>
                    <label className="flex items-center space-x-3 text-xs text-slate-400 cursor-pointer">
                      <input type="radio" name="return" checked={returnMode === 'train'} onChange={() => setReturnMode('train')} className="text-blue-500 focus:ring-0 bg-slate-800" />
                      <span>🚉 Individual Train Commute</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/80 border border-slate-700/60 rounded text-xs space-y-2">
                  {returnMode === 'van' ? (
                    <>
                      <p className="text-green-400 font-bold">⏱️ Van Departure: Leave hotel at 17:30</p>
                      <p className="text-slate-400 text-[11px] leading-tight">
                        **Cost:** {trip.logistics?.minibusCost || 'TBC'}. Direct door-to-terminal runtime (~1.5 hrs). Buys everyone an extra hour of slope/pub time.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-amber-400 font-bold">⏱️ Train Itinerary: Must catch the 16:36 connection</p>
                      <div className="text-[11px] text-slate-400 font-mono pl-2 border-l border-amber-700/50 my-1 space-y-0.5">
                        <p>• 16:36 Depart Andermatt (Regio)</p>
                        <p>• 16:47 Arrive Göschenen → Transfer to IR26</p>
                        <p>• 18:59 Arrive Zurich Airport (ZRH Terminal)</p>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-tight pt-1 border-t border-slate-800">
                        **Standard Train Fare:** {trip.logistics?.trainCostFull?.single || '59'} CHF single / {trip.logistics?.trainCostFull?.return || '118'} CHF return.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
        <button
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="w-full flex justify-between items-center p-5 font-bold text-lg text-blue-400 hover:bg-slate-700/30 transition-colors select-none"
        >
          <span>🗺️ Area Map & Transit Distances</span>
          <span className="text-slate-400 text-sm font-mono">{isMapExpanded ? '[ HIDE ]' : '[ SHOW ]'}</span>
        </button>

        {isMapExpanded && (
          <div className="p-5 pt-0 grid md:grid-cols-2 gap-6 border-t border-slate-700/50 bg-slate-800/40">
            <div className="border border-slate-700 h-[350px] overflow-hidden relative rounded-xl mt-4">
              <iframe
                title={`${trip.resort || 'Trip'} Map`}
                className="absolute top-[-55px] left-0 w-full h-[410px] rounded-lg"
                src={trip.mapUrl || 'https://www.google.com/maps/d/embed?mid=1BzP2w1NHfNj_19WryQ5Jx_dvC22x62A'}
                allowFullScreen=""
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-between mt-4">
              <div>
                <h3 className="text-md font-bold mb-4 text-slate-300">The Morning Commute</h3>
                <ul className="space-y-4 text-slate-300 text-sm">
                  {morningCommute.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.icon} {item.name}</span>
                      <span className="bg-slate-700 px-2 py-1 rounded text-xs">{item.dist}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-700 mt-4">
                <p className="text-xs text-slate-400 italic">
                  🚌 The **Ski Bus (Line 1/3)** stops right near the hotel if you want to skip the walk to Gemsstock.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-hidden">
        <button
          onClick={() => setIsPassExpanded(!isPassExpanded)}
          className="w-full flex justify-between items-center p-5 font-bold text-lg text-blue-400 hover:bg-slate-700/30 transition-colors select-none"
        >
          <span>🎫 Lift Passes & Equipment Hire Discounts</span>
          <span className="text-slate-400 text-sm font-mono">{isPassExpanded ? '[ HIDE ]' : '[ SHOW ]'}</span>
        </button>

        {isPassExpanded && (
          <div className="p-5 pt-0 border-t border-slate-700/50 bg-slate-800/40 space-y-6">
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col justify-between bg-slate-900/30 p-4 rounded-xl border border-slate-700/40">
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <h4 className="font-bold text-blue-300">{passInfo.title}</h4>
                  <p>{passInfo.description}</p>
                  {passInfo.note && <p>{passInfo.note}</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <a href={passInfo.passUrl || trip.logistics?.passUrl} target="_blank" rel="noreferrer" className="inline-block text-xs text-blue-400 hover:underline">
                    View pass details →
                  </a>
                </div>
              </div>

              <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/40 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-blue-300 mb-3">Pass Cost Framework</h4>
                  <div className="space-y-3 mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer text-xs text-slate-300 select-none">
                      <input type="checkbox" checked={useHalfPricePass} onChange={(e) => setUseHalfPricePass(e.target.checked)} className="rounded bg-slate-900 border-slate-600 text-blue-500 focus:ring-0 w-4 h-4" />
                      <span>{passInfo.usePassLabel}</span>
                    </label>
                    {passInfo.showReuseCard && (
                      <label className="flex items-center space-x-3 cursor-pointer text-xs text-slate-300 select-none">
                        <input type="checkbox" checked={reuseCard} onChange={(e) => setReuseCard(e.target.checked)} className="rounded bg-slate-900 border-slate-600 text-blue-500 focus:ring-0 w-4 h-4" />
                        <span className="text-green-400">{passInfo.reuseCardLabel}</span>
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Standard Total</span>
                      <span>{totalWithoutPass} {currency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-400 block">Your Total</span>
                      <span className="text-blue-400 font-bold">{currentLiftTotal} {currency}</span>
                    </div>
                  </div>
                </div>
                <div className={`p-2.5 rounded text-center text-xs font-semibold border mt-4 ${passSavings > 0 ? 'bg-green-950/40 text-green-400 border-green-800/50' : 'bg-slate-900/80 text-slate-500 border-slate-800'}`}>
                  {passSavings > 0 ? `🎉 Saves you ${passSavings} ${currency}! (${passSavings * participants.length} ${currency} group total)` : `Configure options above`}
                </div>
              </div>
            </div>

            {trip.rentals && trip.rentals.length > 0 && (
              <div className="border-t border-slate-700/50 pt-4">
                <h4 className="text-sm font-bold text-slate-200 mb-3">🎿 Equipment Rental Group Discounts</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {trip.rentals.map((rental, index) => (
                    <div key={index} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/60 flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-sm text-slate-200">{rental.shop}</h5>
                        <p className="text-xs text-slate-400 mt-1">{rental.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block bg-green-950 text-green-400 text-xs px-2.5 py-1 font-bold rounded-md border border-green-800 mb-2">
                          {rental.discount}
                        </span>
                        <a href={rental.url} target="_blank" rel="noreferrer" className="block text-[11px] text-blue-400 hover:underline">
                          Book Gear ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-3 text-blue-400">Logistics Overview</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>✈️ Outbound Hub: {trip.flights?.outboundHub || 'LHR'}</li>
              <li>🛬 Destination Hub: {trip.flights?.destinationHub || 'ZRH'}</li>
              <li>🚍 Outbound Mode: {outboundMode === 'split' ? 'Split (Train & Late Minibus)' : 'Consolidated Vans'}</li>
              <li>✨ Return Transfer: {returnMode === 'van' ? 'Private Van (17:30 Depart)' : 'SBB Train (16:36 Depart)'}</li>
            </ul>
          </div>

          {trip.logistics?.tricountUrl && (
            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
              <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(trip.logistics.tricountUrl)}&bgColor=ffffff&color=0f172a`}
                  alt="Tricount QR"
                  className="w-16 h-16"
                  loading="lazy"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">💰 Track Expenses</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Scan to log fuel, round costs, and group dinners.</p>
                <a href={trip.logistics.tricountUrl} target="_blank" rel="noreferrer" className="inline-block text-[11px] text-blue-400 hover:underline mt-1.5 font-medium">Open Direct Link →</a>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-3 text-blue-400">The Crew ({participants.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {participants.map((person, index) => {
              const badge = getStatusBadgeStyles(person.status);
              return (
                <div key={index} className="flex justify-between items-center text-slate-300 text-sm py-1.5 border-b border-slate-700/50">
                  <span>{person.name}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-500 text-xs">
        Built for the Alpine Season {trip.year - 1}/{trip.year ? trip.year.toString().slice(-2) : ''} Group
      </footer>
    </div>
  );
}

export default App;
