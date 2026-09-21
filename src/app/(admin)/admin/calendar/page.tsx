'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Copy, Plus, Trash2, RefreshCw } from 'lucide-react';

type Room = { id: string, name: string, slug: string };
type ICalFeed = { id: string, externalUrl: string, lastSynced: string | null };
type BlockedDate = { id: string, startDate: string, endDate: string, source: string, reason: string | null };

export default function CalendarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [feeds, setFeeds] = useState<ICalFeed[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');

  // Fetch rooms initially
  useEffect(() => {
    fetch('/api/admin/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        if (data.length > 0) setSelectedRoomId(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Fetch room details when selectedRoomId changes
  useEffect(() => {
    if (!selectedRoomId) return;
    fetchFeeds();
    fetchBlockedDates();
  }, [selectedRoomId]);

  const fetchFeeds = async () => {
    try {
      const res = await fetch(`/api/admin/ical-feeds?roomId=${selectedRoomId}`);
      if (res.ok) setFeeds(await res.json());
    } catch (e) {}
  };

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`/api/admin/blocked-dates?roomId=${selectedRoomId}`);
      if (res.ok) setBlockedDates(await res.json());
    } catch (e) {}
  };

  const addFeed = async () => {
    if (!newFeedUrl) return;
    try {
      await fetch('/api/admin/ical-feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: selectedRoomId, externalUrl: newFeedUrl })
      });
      setNewFeedUrl('');
      fetchFeeds();
    } catch (e) {}
  };

  const removeFeed = async (id: string) => {
    try {
      await fetch('/api/admin/ical-feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchFeeds();
    } catch (e) {}
  };

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/api/calendar/export/${slug}.ics`;
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard');
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-[#2D3748]">Calendar & Sync</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#4A5568] mb-2">Select Room</label>
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="w-full max-w-xs border border-[#E0C097] rounded-xl px-4 py-2 outline-none focus:border-[#B85C38] bg-white"
        >
          {rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section A: Calendar placeholder */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-heading font-semibold text-[#2D3748] mb-4">Availability Calendar</h2>
          <div className="bg-[#FAF6F1] rounded-xl p-8 text-center text-[#4A5568] border border-[#E0C097]">
            <CalendarDaysIcon className="mx-auto h-12 w-12 mb-4 text-[#B85C38]" />
            <p>Interactive calendar grid goes here.</p>
            <p className="text-sm mt-2">Booked: <span className="text-[#B85C38] font-bold">Terracotta</span> | OTA: <span className="text-slate-500 font-bold">Slate</span> | Manual: <span className="text-[#A8A29E] font-bold">Warm Grey</span></p>
          </div>
        </div>

        {/* Section B: iCal Feed Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-heading font-semibold text-[#2D3748] mb-4">Your iCal Feed URL</h2>
            <p className="text-sm text-[#4A5568] mb-2">Share this link with OTAs (Booking.com, Airbnb, etc.)</p>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                readOnly 
                value={selectedRoom ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/calendar/export/${selectedRoom.slug}.ics` : ''} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
              />
              <button onClick={() => selectedRoom && handleCopy(selectedRoom.slug)} className="p-2 bg-[#E0C097] text-[#2D3748] rounded-lg hover:bg-[#B85C38] hover:text-white transition-colors">
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-heading font-semibold text-[#2D3748] mb-4">External Calendar Feeds</h2>
            <div className="space-y-4">
              {feeds.map(feed => (
                <div key={feed.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="truncate pr-4 flex-1">
                    <p className="text-sm font-medium text-[#2D3748] truncate">{feed.externalUrl}</p>
                    <p className="text-xs text-[#4A5568]">Last synced: {feed.lastSynced ? formatDate(feed.lastSynced) : 'Never'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Sync Now">
                      <RefreshCw size={16} />
                    </button>
                    <button onClick={() => removeFeed(feed.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Remove Feed">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {feeds.length === 0 && <p className="text-sm text-[#4A5568]">No external feeds connected.</p>}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="https://.../calendar.ics"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    className="flex-1 border border-[#E0C097] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B85C38]"
                  />
                  <button onClick={addFeed} className="px-4 py-2 bg-[#2D3748] text-white rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center">
                    <Plus size={16} className="mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDaysIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>
    </svg>
  );
}
