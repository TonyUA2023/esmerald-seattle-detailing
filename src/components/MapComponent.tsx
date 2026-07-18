"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Service area locations
const SERVICE_LOCATIONS: { name: string; coords: [number, number] }[] = [
  { name: "Seattle",        coords: [47.6062, -122.3321] },
  { name: "Bellevue",       coords: [47.6101, -122.2015] },
  { name: "Kirkland",       coords: [47.6815, -122.2087] },
  { name: "Redmond",        coords: [47.6740, -122.1215] },
  { name: "Shoreline",      coords: [47.7540, -122.3418] },
  { name: "Renton",         coords: [47.4829, -122.2171] },
  { name: "Issaquah",       coords: [47.5301, -122.0326] },
  { name: "Edmonds",        coords: [47.8107, -122.3774] },
  { name: "Kenmore",        coords: [47.7565, -122.2421] },
  { name: "Mercer Island",  coords: [47.5707, -122.2221] },
  { name: "Bothell",        coords: [47.7623, -122.2054] },
  { name: "Tacoma",         coords: [47.2529, -122.4443] },
];

// Center of the full service area
const SERVICE_CENTER: [number, number] = [47.58, -122.24];
// Radius in meters (≈ 35 miles)
const SERVICE_RADIUS_M = 56_000;

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: SERVICE_CENTER,
      zoom: 9.5,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    // Light minimal tile — matches the reference screenshot style
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // ── Large dashed service-area circle ──────────────────────────────────
    L.circle(SERVICE_CENTER, {
      radius: SERVICE_RADIUS_M,
      color: "#10B981",
      weight: 2,
      dashArray: "10 8",
      fillColor: "#10B981",
      fillOpacity: 0.06,
      interactive: false,
    }).addTo(map);

    // ── Custom emerald drop-pin icon ──────────────────────────────────────
    const pinIcon = (label: string) =>
      L.divIcon({
        className: "",
        html: `
          <div style="
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:3px;
            pointer-events:none;
          ">
            <div style="
              background:#10B981;
              width:14px;
              height:14px;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:2.5px solid #ffffff;
              box-shadow:0 2px 8px rgba(16,185,129,0.55);
            "></div>
          </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 14],
        popupAnchor: [0, -16],
      });

    // ── Add markers for each service location ─────────────────────────────
    SERVICE_LOCATIONS.forEach(({ name, coords }) => {
      const marker = L.marker(coords, { icon: pinIcon(name) }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:sans-serif;font-size:13px;font-weight:700;color:#0A1428;min-width:120px">
          📍 ${name}
          <div style="font-weight:400;font-size:11px;color:#6B7280;margin-top:3px">Esmerald Apex Mobile Detailing</div>
        </div>`,
        { closeButton: false, maxWidth: 180 }
      );
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", zIndex: 1, borderRadius: "inherit" }}
    />
  );
}
