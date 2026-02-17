"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Barn } from "@/lib/types";

const DISCIPLINES = ["dressage", "jumping", "western", "eventing", "trail"];
const BOARDING_TYPES = ["full", "partial", "pasture", "self-care"];

interface BarnFormProps {
  barn?: Barn;
  mode: "create" | "edit";
}

export default function BarnForm({ barn, mode }: BarnFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(barn?.name || "");
  const [description, setDescription] = useState(barn?.description || "");
  const [street, setStreet] = useState(barn?.address.street || "");
  const [city, setCity] = useState(barn?.address.city || "");
  const [state, setState] = useState(barn?.address.state || "");
  const [zip, setZip] = useState(barn?.address.zip || "");
  const [lat, setLat] = useState(barn?.address.lat?.toString() || "");
  const [lng, setLng] = useState(barn?.address.lng?.toString() || "");
  const [phone, setPhone] = useState(barn?.phone || "");
  const [website, setWebsite] = useState(barn?.website || "");
  const [email, setEmail] = useState(barn?.email || "");
  const [disciplines, setDisciplines] = useState<string[]>(barn?.disciplines || []);
  const [indoorArena, setIndoorArena] = useState(barn?.amenities.indoorArena || false);
  const [outdoorArena, setOutdoorArena] = useState(barn?.amenities.outdoorArena || false);
  const [trails, setTrails] = useState(barn?.amenities.trails || false);
  const [roundPen, setRoundPen] = useState(barn?.amenities.roundPen || false);
  const [hotWalker, setHotWalker] = useState(barn?.amenities.hotWalker || false);
  const [washRack, setWashRack] = useState(barn?.amenities.washRack || false);
  const [boardingTypes, setBoardingTypes] = useState<string[]>(barn?.boarding.types || []);
  const [stallCount, setStallCount] = useState(barn?.boarding.stallCount?.toString() || "0");
  const [turnout, setTurnout] = useState<"individual" | "group" | "both">(barn?.boarding.turnout || "both");
  const [boardingFrom, setBoardingFrom] = useState(barn?.pricing.boardingFrom?.toString() || "0");
  const [lessonsFrom, setLessonsFrom] = useState(barn?.pricing.lessonsFrom?.toString() || "0");
  const [lessonAvailability, setLessonAvailability] = useState(barn?.lessonAvailability ?? true);

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      description,
      address: {
        street,
        city,
        state,
        zip,
        lat: parseFloat(lat) || 0,
        lng: parseFloat(lng) || 0,
      },
      phone,
      website,
      email,
      disciplines,
      amenities: { indoorArena, outdoorArena, trails, roundPen, hotWalker, washRack },
      boarding: {
        types: boardingTypes,
        stallCount: parseInt(stallCount) || 0,
        turnout,
      },
      pricing: {
        boardingFrom: parseInt(boardingFrom) || 0,
        lessonsFrom: parseInt(lessonsFrom) || 0,
        currency: "USD",
      },
      lessonAvailability,
      trainers: barn?.trainers || [],
      horseBreeds: barn?.horseBreeds || [],
      photos: barn?.photos || [],
    };

    const url = mode === "edit" ? `/api/barns/${barn!.id}` : "/api/barns";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d5016] text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Basic Info */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div>
          <label className={labelClass}>Barn Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://" />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Address</h2>
        <div>
          <label className={labelClass}>Street</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>City *</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State *</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} required maxLength={2} className={inputClass} placeholder="e.g. VA" />
          </div>
          <div>
            <label className={labelClass}>ZIP</label>
            <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Disciplines</h2>
        <div className="flex flex-wrap gap-3">
          {DISCIPLINES.map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={disciplines.includes(d)}
                onChange={() => toggleItem(disciplines, d, setDisciplines)}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm capitalize">{d}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {([
            ["indoorArena", "Indoor Arena", indoorArena, setIndoorArena],
            ["outdoorArena", "Outdoor Arena", outdoorArena, setOutdoorArena],
            ["trails", "Trails", trails, setTrails],
            ["roundPen", "Round Pen", roundPen, setRoundPen],
            ["hotWalker", "Hot Walker", hotWalker, setHotWalker],
            ["washRack", "Wash Rack", washRack, setWashRack],
          ] as const).map(([key, label, value, setter]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={() => (setter as (v: boolean) => void)(!(value as boolean))}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Boarding */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Boarding</h2>
        <div className="flex flex-wrap gap-3">
          {BOARDING_TYPES.map((bt) => (
            <label key={bt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={boardingTypes.includes(bt)}
                onChange={() => toggleItem(boardingTypes, bt, setBoardingTypes)}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm capitalize">{bt}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Number of Stalls</label>
            <input type="number" value={stallCount} onChange={(e) => setStallCount(e.target.value)} min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Turnout</label>
            <select value={turnout} onChange={(e) => setTurnout(e.target.value as "individual" | "group" | "both")} className={inputClass}>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Pricing & Lessons</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Boarding From ($/month)</label>
            <input type="number" value={boardingFrom} onChange={(e) => setBoardingFrom(e.target.value)} min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Lessons From ($/lesson)</label>
            <input type="number" value={lessonsFrom} onChange={(e) => setLessonsFrom(e.target.value)} min="0" className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lessonAvailability}
            onChange={() => setLessonAvailability(!lessonAvailability)}
            className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
          />
          <span className="text-sm">Lessons currently available</span>
        </label>
      </section>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d5016] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a7c28] transition disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "edit" ? "Update Listing" : "Create Listing"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
