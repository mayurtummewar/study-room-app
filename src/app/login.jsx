"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		setError("");
		if (typeof window === 'undefined') return;
		const raw = localStorage.getItem('users');
		const users = raw ? JSON.parse(raw) : [];
		const user = users.find(u => u.username === username);
		if (!user) {
			setError('User not found. Please sign up first.');
			return;
		}
		if (user.password !== password) {
			setError('Incorrect password');
			return;
		}

		// successful login: set current user
		localStorage.setItem('username', username);
		// ensure per-user roomsVisited and studyDays exist
		const keyRooms = `roomsVisited:${username}`;
		const keyStudy = `studyDays:${username}`;
		if (!localStorage.getItem(keyRooms)) localStorage.setItem(keyRooms, JSON.stringify([]));
		if (!localStorage.getItem(keyStudy)) localStorage.setItem(keyStudy, JSON.stringify({}));
		router.push('/home');
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white p-8 rounded shadow">
				<h2 className="text-2xl font-bold mb-6 text-center">Sign in to Study Rooms</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Username</label>
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full border rounded px-3 py-2"
							placeholder="Enter username"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border rounded px-3 py-2"
							placeholder="Enter password"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
					>
						Login
					</button>

					<div className="mt-2">
						<button
							type="button"
							onClick={() => router.push("/signup")}
							className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
						>
							Signup
						</button>
					</div>

					{error && (
						<div className="text-sm text-red-600 mt-2" role="alert">{error}</div>
					)}
				</form>
			</div>
		</div>
	);
}
