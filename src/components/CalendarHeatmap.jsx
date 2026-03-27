"use client";

import React from "react";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function colorClass(count) {
  if (!count) return "bg-gray-100";
  if (count === 1) return "bg-green-200";
  if (count === 2) return "bg-green-400";
  if (count === 3) return "bg-green-600";
  return "bg-green-800"; // 4+
}

export default function CalendarHeatmap({ data = {} }) {
  // data: { 'YYYY-MM-DD': number }
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 364);

  // Align to previous Sunday so columns represent weeks
  const startSunday = new Date(start);
  startSunday.setDate(startSunday.getDate() - startSunday.getDay());

  const weeks = [];
  let cursor = new Date(startSunday);
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(cursor);
      const iso = formatDate(day);
      if (day < start || day > end) {
        week.push(null);
      } else {
        week.push({ date: iso, count: data[iso] || 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div>
      <div className="flex space-x-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col space-y-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day ? `${day.date} — ${day.count} study(s)` : ""}
                className={`w-3 h-3 rounded-sm ${day ? colorClass(Math.min(day.count, 4)) : "bg-transparent"}`}
                style={{ width: 12, height: 12 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">Last 365 days</div>
      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-100 rounded-sm" />
        <div className="w-3 h-3 bg-green-200 rounded-sm" />
        <div className="w-3 h-3 bg-green-400 rounded-sm" />
        <div className="w-3 h-3 bg-green-600 rounded-sm" />
        <div className="w-3 h-3 bg-green-800 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
}
