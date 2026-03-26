"use client";

export default function Timer({ isStudy, timeLeft }) {
  const formatTime = (time) => {
    const m = Math.floor(Math.max(time, 0) / 60);
    const s = Math.max(time, 0) % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border p-4 rounded-xl text-center shadow-md">
      <h2 className="text-xl font-bold mb-2">
        {isStudy ? "Study Time 📚" : "Break Time ☕"}
      </h2>

      <p className="text-3xl font-mono">{formatTime(timeLeft)}</p>
    </div>
  );
}