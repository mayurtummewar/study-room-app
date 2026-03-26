// A card that displays room title, topic, member count, and a Join button

import Link from "next/link";

export default function RoomCard({ room }) {
  return (
    <div className="border p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold">{room.title}</h2>
      <p className="text-gray-600">{room.topic}</p>
      <p className="text-sm mt-2">Members: {room.members}</p>

      <Link href={`/rooms/${room.id}`}>
        <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
          Join Room
        </button>
      </Link>
    </div>
  );
}