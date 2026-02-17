"use client";

import { useEffect, useState } from "react";
import { Barn } from "@/lib/types";

interface MapViewProps {
  barns: Barn[];
}

export default function MapView({ barns }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
  } | null>(null);

  useEffect(() => {
    // Dynamically import leaflet and react-leaflet on client only
    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
    ]).then(([L, RL]) => {
      // Fix default marker icons for leaflet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
      });
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !MapComponents) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  // Center on US
  const center: [number, number] = barns.length > 0
    ? [
        barns.reduce((sum, b) => sum + b.address.lat, 0) / barns.length,
        barns.reduce((sum, b) => sum + b.address.lng, 0) / barns.length,
      ]
    : [39.8283, -98.5795];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <MapContainer
        center={center}
        zoom={4}
        className="h-[500px] rounded-xl z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {barns.map((barn) => (
          <Marker key={barn.id} position={[barn.address.lat, barn.address.lng]}>
            <Popup>
              <div className="text-sm">
                <a
                  href={`/barns/${barn.slug}`}
                  className="font-semibold text-[#2d5016] hover:underline"
                >
                  {barn.name}
                </a>
                <p className="text-gray-500 mt-1">
                  {barn.address.city}, {barn.address.state}
                </p>
                <div className="flex gap-1 mt-1">
                  {barn.disciplines.slice(0, 3).map((d) => (
                    <span key={d} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded capitalize">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
