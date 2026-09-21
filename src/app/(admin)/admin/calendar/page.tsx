'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDate } from '@/lib/utils';
import { 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Globe, 
  Info, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

type Room = { id: string; name: string; slug: string; type: string };
type ICalFeed = { id: string; externalUrl: string; lastSynced: string | null; isActive: boolean };
type BlockedDate = { id: string; startDate: string; endDate: string; source: string; reason: string | null };
type Booking = { id: string; guestName: string; checkIn: string; checkOut: string; numberOfGuests: number; totalAmount: number };

export default function CalendarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [feeds, setFeeds] = useState<ICalFeed[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [syncingFeedId, setSyncingFeedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual block form state
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Calendar navigation state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // Fetch rooms on mount
  useEffect(() => {
    async function loadRooms() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/rooms');
        if (!res.ok) {
          // Fallback to public rooms endpoint if admin fails
          const fallbackRes = await fetch('/api/rooms');
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            const roomList = data.rooms || data || [];
            setRooms(roomList);
            if (roomList.length > 0) setSelectedRoomId(roomList[0].id);
          }
          return;
        }
        const data = await res.json();
        setRooms(data);
        if (data.length > 0) setSelectedRoomId(data[0].id);
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);


  const loadRoomEvents = useCallback(async (roomId: string) => {
    if (!roomId) return;
    try {
      // 1. Fetch Calendar Events (Confirmed bookings & all blocked dates)
      const eventsRes = await fetch(`/api/admin/calendar-events?roomId=${roomId}`);
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setBookings(data.bookings || []);
        setBlockedDates(data.blockedDates || []);
      }

      // 2. Fetch iCal Feeds
      const feedsRes = await fetch(`/api/admin/ical-feeds?roomId=${roomId}`);
      if (feedsRes.ok) {
        setFeeds(await feedsRes.json());
      }
    } catch (e) {
      console.error('Error loading calendar data:', e);
    }
  }, []);

  useEffect(() => {
    if (selectedRoomId) {
      loadRoomEvents(selectedRoomId);
    }
  }, [selectedRoomId, loadRoomEvents]);

  // Copy feed URL handler
  const handleCopy = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/api/calendar/export/${slug}.ics`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Add new external feed (e.g. Booking.com export)
  const addFeed = async () => {
    if (!newFeedUrl || !selectedRoomId) return;
    try {
      const res = await fetch('/api/admin/ical-feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: selectedRoomId, externalUrl: newFeedUrl.trim() }),
      });
      if (res.ok) {
        const feed = await res.json();
        setNewFeedUrl('');
        setStatusMessage({ type: 'success', text: 'External calendar feed added successfully!' });
        loadRoomEvents(selectedRoomId);
        // Automatically run first sync
        if (feed.id) triggerSync(feed.id);
      } else {
        const err = await res.json();
        setStatusMessage({ type: 'error', text: err.error || 'Failed to add feed' });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Error connecting feed' });
    }
  };

  // Remove external feed
  const removeFeed = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this external calendar?')) return;
    try {
      const res = await fetch('/api/admin/ical-feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'External feed removed.' });
        loadRoomEvents(selectedRoomId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger sync with external OTA feed
  const triggerSync = async (feedId: string) => {
    try {
      setSyncingFeedId(feedId);
      setStatusMessage(null);
      const res = await fetch('/api/calendar-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ 
          type: 'success', 
          text: `Calendar synced! Successfully imported ${data.syncedCount || 0} reservation date range(s).` 
        });
        loadRoomEvents(selectedRoomId);
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: data.error || 'Failed to fetch calendar from remote URL. Verify the link is public.' 
        });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Network error during sync' });
    } finally {
      setSyncingFeedId(null);
    }
  };

  // Create manual block
  const handleManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd || !selectedRoomId) return;

    if (new Date(blockStart) >= new Date(blockEnd)) {
      alert('End date must be strictly after Start date.');
      return;
    }

    try {
      setIsBlocking(true);
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          startDate: blockStart,
          endDate: blockEnd,
          reason: blockReason.trim() || 'Manual Admin Block',
        }),
      });

      if (res.ok) {
        setBlockStart('');
        setBlockEnd('');
        setBlockReason('');
        setStatusMessage({ type: 'success', text: 'Dates blocked successfully on calendar!' });
        loadRoomEvents(selectedRoomId);
      } else {
        const err = await res.json();
        setStatusMessage({ type: 'error', text: err.error || 'Failed to block dates' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving block' });
    } finally {
      setIsBlocking(false);
    }
  };

  // Delete manual block
  const deleteBlock = async (id: string) => {
    if (!confirm('Unblock these dates?')) return;
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Date range unblocked.' });
        loadRoomEvents(selectedRoomId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper functions for Calendar Month Grid
  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Generate calendar days for current view
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Helper to determine day status
  const getDayStatus = (day: number) => {
    const dateObj = new Date(year, month, day, 12, 0, 0); // Noon to avoid timezone boundary issues
    const time = dateObj.getTime();

    // Check confirmed direct bookings (start inclusive, end exclusive)
    for (const b of bookings) {
      const start = new Date(b.checkIn).getTime();
      const end = new Date(b.checkOut).getTime();
      if (time >= start && time < end) {
        return { type: 'BOOKED', label: b.guestName || 'Direct Booking', item: b };
      }
    }

    // Check blocked dates
    for (const blk of blockedDates) {
      const start = new Date(blk.startDate).getTime();
      const end = new Date(blk.endDate).getTime();
      if (time >= start && time < end) {
        if (blk.source === 'OTA_SYNC') {
          return { type: 'OTA', label: blk.reason || 'Booking.com', item: blk };
        }
        return { type: 'MANUAL', label: blk.reason || 'Blocked', item: blk };
      }
    }

    return { type: 'AVAILABLE', label: 'Available', item: null };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E0C097]/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B85C38] uppercase bg-[#B85C38]/10 px-3 py-1 rounded-full mb-2">
            <Globe size={13} /> Two-Way Channel Sync
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#2D3748]">Calendar & Availability</h1>
          <p className="text-sm text-[#4A5568] mt-1">
            Real-time synchronization between House Of Karma direct bookings, Booking.com, and OTA channels.
          </p>
        </div>

        {/* Room Switcher */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-[#E0C097]/60">
          <label className="text-xs font-semibold text-[#4A5568] uppercase pl-2">Room:</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="border-none font-medium text-sm text-[#2D3748] outline-none bg-transparent cursor-pointer pr-4"
          >
            {loading && rooms.length === 0 ? (
              <option>Loading rooms...</option>
            ) : (
              rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.type})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          <span className="flex-1 font-medium">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100 underline">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Calendar on Left, Sync Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visual Monthly Calendar (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0C097]/40 p-6">
            
            {/* Calendar Header with Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-[#2D3748]">{monthName}</h2>
                <p className="text-xs text-[#9B8B7E]">
                  Showing availability for <span className="font-semibold text-[#5C3D2E]">{selectedRoom?.name || 'Selected Room'}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 bg-[#FAF6F1] p-1 rounded-xl border border-[#E0C097]/40">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-[#2D3748]"
                  title="Previous Month"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-[#2D3748]"
                  title="Next Month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium mb-5 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1.5 text-[#2D3748]">
                <span className="w-3 h-3 rounded-full bg-[#B85C38]"></span> Direct Booking
              </span>
              <span className="flex items-center gap-1.5 text-[#2D3748]">
                <span className="w-3 h-3 rounded-full bg-[#4A5568]"></span> Booking.com / OTA
              </span>
              <span className="flex items-center gap-1.5 text-[#2D3748]">
                <span className="w-3 h-3 rounded-full bg-[#9B8B7E]"></span> Manual Block
              </span>
              <span className="flex items-center gap-1.5 text-[#2D3748]">
                <span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></span> Available
              </span>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#9B8B7E] mb-2 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty placeholder days for first week alignment */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 rounded-xl bg-gray-50/50 border border-transparent"></div>
              ))}

              {/* Real Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const status = getDayStatus(dayNum);
                const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

                let bgClass = 'bg-[#FAF6F1]/50 border-gray-100 hover:border-[#E0C097]';
                let tagClass = 'text-emerald-700 bg-emerald-50';

                if (status.type === 'BOOKED') {
                  bgClass = 'bg-[#B85C38]/10 border-[#B85C38]/40';
                  tagClass = 'bg-[#B85C38] text-white';
                } else if (status.type === 'OTA') {
                  bgClass = 'bg-[#4A5568]/10 border-[#4A5568]/40';
                  tagClass = 'bg-[#4A5568] text-white';
                } else if (status.type === 'MANUAL') {
                  bgClass = 'bg-[#9B8B7E]/15 border-[#9B8B7E]/40';
                  tagClass = 'bg-[#9B8B7E] text-white';
                }

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`h-20 rounded-xl border p-1.5 flex flex-col justify-between transition-all ${bgClass} ${
                      isToday ? 'ring-2 ring-[#B85C38] ring-offset-1' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isToday ? 'text-[#B85C38]' : 'text-[#2D3748]'}`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] uppercase font-bold text-[#B85C38] tracking-wider">Today</span>
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <span className={`text-[10px] block truncate font-medium rounded px-1 py-0.5 text-center ${tagClass}`} title={status.label}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Manual Date Block Console */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0C097]/40 p-6">
            <h3 className="text-lg font-heading font-bold text-[#2D3748] mb-1 flex items-center gap-2">
              <Lock size={18} className="text-[#B85C38]" /> Manual Room Block
            </h3>
            <p className="text-xs text-[#4A5568] mb-4">
              Block dates for offline phone reservations, deep cleaning, or room repairs. These dates will automatically be closed on both your website and Booking.com.
            </p>

            <form onSubmit={handleManualBlock} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full border border-[#E0C097] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B85C38] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full border border-[#E0C097] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B85C38] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Offline Walk-in"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full border border-[#E0C097] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#B85C38] bg-white"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isBlocking}
                  className="px-5 py-2.5 bg-[#B85C38] text-white text-sm font-semibold rounded-xl hover:bg-[#8B3A1F] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock size={15} /> {isBlocking ? 'Blocking...' : 'Block Selected Dates'}
                </button>
              </div>
            </form>

            {/* List of active manual blocks */}
            {blockedDates.filter(b => b.source === 'MANUAL').length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold uppercase text-[#9B8B7E] mb-2">Active Manual Blocks</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {blockedDates.filter(b => b.source === 'MANUAL').map(b => (
                    <div key={b.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF6F1] border border-[#E0C097]/40 text-xs">
                      <div>
                        <span className="font-bold text-[#2D3748]">
                          {formatDate(b.startDate)} — {formatDate(b.endDate)}
                        </span>
                        <span className="text-[#9B8B7E] ml-2 italic">({b.reason || 'Blocked'})</span>
                      </div>
                      <button
                        onClick={() => deleteBlock(b.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Unblock dates"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Two-Way Synchronization Setup (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Outbound iCal (Send to Booking.com) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0C097]/40 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-lg font-heading font-bold text-[#2D3748]">Export Feed to Booking.com</h2>
            </div>
            <p className="text-xs text-[#4A5568] mb-3">
              Give this unique URL to Booking.com. Whenever a guest books directly on House Of Karma, Booking.com reads this feed and instantly blocks those dates.
            </p>

            <div className="flex items-center gap-2 bg-[#FAF6F1] border border-[#E0C097] rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={selectedRoom ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/calendar/export/${selectedRoom.slug}.ics` : ''}
                className="flex-1 bg-transparent text-xs text-[#2D3748] font-mono outline-none select-all truncate"
              />
              <button
                onClick={() => selectedRoom && handleCopy(selectedRoom.slug)}
                className="px-3 py-1.5 bg-[#B85C38] text-white rounded-lg text-xs font-semibold hover:bg-[#8B3A1F] transition-colors flex items-center gap-1 shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="mt-3 p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 flex gap-2">
              <Info size={16} className="shrink-0 text-blue-600 mt-0.5" />
              <div>
                <strong>Where to paste in Booking.com Extranet:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-0.5 text-[11px] text-blue-800">
                  <li>Go to <strong>Rates & Availability</strong> → <strong>Sync Calendars</strong></li>
                  <li>Click <strong>Add calendar connection</strong></li>
                  <li>Paste this URL as your <strong>Calendar link</strong></li>
                  <li>Name it <em>"House of Karma Direct"</em> and save!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 2: Inbound iCal (Import from Booking.com) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E0C097]/40 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#2D3748] text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-lg font-heading font-bold text-[#2D3748]">Import Feeds from Booking.com</h2>
            </div>
            <p className="text-xs text-[#4A5568] mb-3">
              Paste Booking.com’s export calendar link below to block those dates on the House Of Karma website.
            </p>

            {/* List connected feeds */}
            <div className="space-y-3 mb-4">
              {feeds.map(feed => (
                <div key={feed.id} className="p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between gap-3">
                  <div className="truncate flex-1">
                    <p className="text-xs font-mono text-[#2D3748] truncate" title={feed.externalUrl}>
                      {feed.externalUrl}
                    </p>
                    <p className="text-[11px] text-[#9B8B7E] mt-0.5">
                      Last synced: {feed.lastSynced ? formatDate(feed.lastSynced) : 'Never synced'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => triggerSync(feed.id)}
                      disabled={syncingFeedId === feed.id}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sync Now"
                    >
                      <RefreshCw size={16} className={syncingFeedId === feed.id ? 'animate-spin' : ''} />
                    </button>
                    <button
                      onClick={() => removeFeed(feed.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Feed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {feeds.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                  <CalendarIcon size={24} className="mx-auto text-[#9B8B7E] mb-2" />
                  <p className="text-xs text-[#4A5568] font-medium">No external feeds connected yet.</p>
                  <p className="text-[11px] text-[#9B8B7E] mt-0.5">Paste your Booking.com or Airbnb iCal URL below.</p>
                </div>
              )}
            </div>

            {/* Add Feed Input */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Add New iCal URL (.ics)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://admin.booking.com/.../calendar.ics"
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                  className="flex-1 border border-[#E0C097] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B85C38] bg-white font-mono"
                />
                <button
                  onClick={addFeed}
                  disabled={!newFeedUrl.trim()}
                  className="px-4 py-2 bg-[#2D3748] text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1 disabled:opacity-50 shrink-0"
                >
                  <Plus size={15} /> Connect
                </button>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Guide for Hostel Staff */}
          <div className="bg-[#FAF6F1] rounded-2xl border border-[#E0C097]/60 p-5 text-xs text-[#4A5568] space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#2D3748]">💡 How the Parallel Sync Works:</h4>
            <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
              <li><strong>Zero Double Bookings:</strong> Whenever someone books via your website, Booking.com checks your export feed and locks those dates on their platform.</li>
              <li><strong>OTA Protection:</strong> When Booking.com receives a reservation, this calendar imports the dates and automatically marks them unavailable on your website.</li>
              <li><strong>Local Testing Note:</strong> While testing on <code>localhost:3000</code>, Booking.com’s servers cannot reach your computer. Once deployed to your live domain (e.g. <code>houseofkarma.in</code> or Vercel), Booking.com will poll your feed automatically every 15–30 minutes.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
