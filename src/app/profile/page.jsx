"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CalendarHeatmap from "../../components/CalendarHeatmap";
import { rooms as mockRooms } from "../../lib/mockData";

function Avatar({ name }) {
  const initials = (name || "User").split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [roomsVisited, setRoomsVisited] = useState([]);
  const [studyData, setStudyData] = useState({});
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Try to read some real-ish state from localStorage if present
    const storedUser = typeof window !== 'undefined' && localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    // read per-user roomsVisited and studyDays keyed by username
    if (storedUser) {
      const keyRooms = `roomsVisited:${storedUser}`;
      const storedRooms = localStorage.getItem(keyRooms);
      if (storedRooms) {
        try { setRoomsVisited(JSON.parse(storedRooms)); } catch (e) { /* ignore */ }
      } else {
        setRoomsVisited(mockRooms.slice(0,3).map(r => ({ id: r.id, name: r.name }))); 
      }

      const keyStudy = `studyDays:${storedUser}`;
      const storedStudy = localStorage.getItem(keyStudy);
      if (storedStudy) {
        try { setStudyData(JSON.parse(storedStudy)); } catch (e) { /* ignore */ }
      } else {
      // Generate sample random activity for the last ~120 days
      const data = {};
      const today = new Date();
      for (let i = 0; i < 120; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0,10);
        const r = Math.random();
        if (r > 0.7) data[iso] = Math.ceil(r * 4);
      }
      setStudyData(data);
      }
    } else {
      // no user signed in — show fallback sample rooms and generated study data
      setRoomsVisited(mockRooms.slice(0,3).map(r => ({ id: r.id, name: r.name })));
      const data = {};
      const today = new Date();
      for (let i = 0; i < 120; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0,10);
        const r = Math.random();
        if (r > 0.7) data[iso] = Math.ceil(r * 4);
      }
      setStudyData(data);
    }
  }, []);

  const totalVisited = useMemo(() => roomsVisited.length, [roomsVisited]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <Avatar name={username || 'Guest User'} />
            <div>
              <h1 className="text-2xl font-bold">{username || 'Guest User'}</h1>
              <div className="text-sm text-gray-600">{totalVisited} room(s) visited</div>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                // clear session username but preserve per-user stored data
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('username');
                }
                setUsername('');
                setRoomsVisited([]);
                setStudyData({});
                setShowLogoutToast(true);
                setTimeout(() => {
                  setShowLogoutToast(false);
                  // redirect to login page
                  router.push('/');
                }, 2200);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Study activity</h2>
            <CalendarHeatmap data={studyData} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Rooms visited</h2>
            <ul className="space-y-2">
              {roomsVisited.map(r => (
                <li key={r.id} className="p-2">
                  <div className="font-medium">{r.name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showLogoutToast && (
          // Centered modal with dim overlay
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="relative bg-white rounded-lg p-6 shadow-lg w-80 text-center">
              <div className="text-lg font-medium">logout successful</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
