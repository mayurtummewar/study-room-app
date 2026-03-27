"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Timer from "../../../components/Timer";
import ChatBox from "../../../components/ChatBox";
import ResourceList from "../../../components/ResourceList";
import { rooms } from "../../../lib/mockData";
import { socket } from "../../../lib/socket";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId;

  const [isStudy, setIsStudy] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [userName] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('username');
      if (stored) return stored;
    }
    return `Guest-${Math.floor(Math.random() * 1000)}`;
  });
  const [users, setUsers] = useState([]);

  const room = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    if (!roomId) return;

    const handleConnect = () => {
      setConnected(true);
      socket.emit("room:join", { roomId, userName });
    };

    const handleDisconnect = () => setConnected(false);

    const handleTimerSync = (state) => {
      setIsStudy(state.phase === "study");
      setTimeLeft(state.timeLeft);
    };

    const handleTimerUpdate = (state) => {
      setIsStudy(state.phase === "study");
      setTimeLeft(state.timeLeft);
    };

    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleSystemMessage = (msg) => {
      setMessages((prev) => [...prev, { ...msg, system: true }]);
    };

    const handleSessionComplete = () => {
      setStreak((prev) => prev + 1);
    };

    const handleUsersUpdate = (usersList) => {
      setUsers(usersList);
    };


    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("timer:sync", handleTimerSync);
    socket.on("timer:update", handleTimerUpdate);
    socket.on("chat:message", handleChatMessage);
    socket.on("chat:system", handleSystemMessage);
    socket.on("session:complete", handleSessionComplete);
    socket.on("room:users", handleUsersUpdate);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("timer:sync", handleTimerSync);
      socket.off("timer:update", handleTimerUpdate);
      socket.off("chat:message", handleChatMessage);
      socket.off("chat:system", handleSystemMessage);
      socket.off("session:complete", handleSessionComplete);
      socket.off("room:users", handleUsersUpdate);
      socket.disconnect();
    };
  }, [roomId, userName]);

  if (!room) {
    return <p className="p-6">Room not found</p>;
  }

  const sendMessage = (message) => {
    socket.emit("chat:message", { roomId, userName, message });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{room.title}</h1>

      <p className="mb-1 text-green-600 font-semibold">🔥 Streak: {streak}</p>
      <p className="mb-3 text-sm text-gray-500">
        {connected ? "Connected live" : "Connecting..."}
      </p>

      <Timer isStudy={isStudy} timeLeft={timeLeft} />

      <div className="mb-4 border p-3 rounded-xl bg-gray-50">
        <p className="font-semibold mb-2">
          👥 Active Users ({users.length})
        </p>

        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <span
              key={u.socketId}
              className="px-2 py-1 bg-blue-100 rounded text-sm"
            >
              {u.userName}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded ${activeTab === "chat" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Chat
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded ${activeTab === "resources" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Resources
        </button>

        <button
          onClick={() => setActiveTab("whiteboard")}
          className={`px-4 py-2 rounded ${activeTab === "whiteboard" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Whiteboard
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "chat" && (
          <ChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isStudy={isStudy}
          />
        )}

        {activeTab === "resources" && <ResourceList resources={room.resources} />}

        {activeTab === "whiteboard" && <p>Whiteboard coming soon ✍️</p>}
      </div>
    </div>
  );
}