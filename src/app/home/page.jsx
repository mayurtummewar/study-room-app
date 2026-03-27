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
      <h1 className="text-3xl font-bold mb-6">Study Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
