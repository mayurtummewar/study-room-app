"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  function handleSignup(e) {
    e.preventDefault();
    setError("");
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : [];

    // check for existing username
    if (users.find(u => u.username === name)) {
      setError('Username already exists. Please choose another.');
      return;
    }

  // store new user (we keep password as plain text for the demo)
  const newUser = { username: name, password, email };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  // set current session username
  localStorage.setItem('username', name);
  // initialize per-user roomsVisited and studyDays for this user if not present
  const keyRooms = `roomsVisited:${name}`;
  const keyStudy = `studyDays:${name}`;
  if (!localStorage.getItem(keyRooms)) localStorage.setItem(keyRooms, JSON.stringify([]));
  if (!localStorage.getItem(keyStudy)) localStorage.setItem(keyStudy, JSON.stringify({}));

    router.push('/home');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Signup
          </button>
        </form>
        {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
      </div>
    </div>
  );
}
