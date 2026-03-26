"use client";

// Displays list of shared study resources

export default function ResourceList({ resources }) {
  return (
    <div className="border p-4 rounded-xl shadow-md">
      <h2 className="font-bold mb-2">Resources</h2>

      {resources.length === 0 ? (
        <p className="text-gray-400">No resources yet</p>
      ) : (
        <ul className="space-y-2">
          {resources.map((res, index) => (
            <li
              key={index}
              className="p-2 border rounded flex justify-between"
            >
              <span>{res.name}</span>
              <span className="text-xs bg-gray-200 px-2 rounded">
                {res.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}