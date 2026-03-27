"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { rooms } from "../../lib/mockData";
import RoomCard from "../../components/RoomCard";

export default function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("username");
      if (u) setUsername(u);
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Study Rooms</h1>

        <Link href="/profile">
          <button className="px-3 py-1 bg-gray-100 rounded flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
              {username ? username.slice(0,1).toUpperCase() : "G"}
            </span>
            <span className="text-sm">{username || "Guest"}</span>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
