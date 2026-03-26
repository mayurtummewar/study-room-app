"use client";

import { useState } from "react";

export default function ChatBox({ messages, onSendMessage, isStudy }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStudy) return;

    onSendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="border p-4 rounded-xl shadow-md">
      <h2 className="font-bold mb-2">Group Chat</h2>

      <div className="h-40 overflow-y-auto border mb-2 p-2 rounded bg-white">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-2 text-sm">
              {msg.system ? (
                <p className="text-gray-400 italic">{msg.text}</p>
              ) : (
                <>
                  <p className="font-semibold">{msg.userName}</p>
                  <p>{msg.message}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isStudy}
          placeholder={isStudy ? "Chat disabled during study" : "Type a message..."}
        />

        <button
          onClick={handleSend}
          disabled={isStudy}
          className={`px-4 py-2 rounded text-white ${
            isStudy ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}