"use client";

interface ViewToggleProps {
  view: "list" | "map";
  onChange: (view: "list" | "map") => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange("list")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
          view === "list"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        List
      </button>
      <button
        onClick={() => onChange("map")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
          view === "map"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Map
      </button>
    </div>
  );
}
