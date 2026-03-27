"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		// For now we don't validate; navigate to the main app page.
		router.push("/home");
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
				</form>
			</div>
		</div>
	);
}
