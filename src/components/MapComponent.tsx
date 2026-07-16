"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Centered between Seattle and Bellevue
    const map = L.map(mapRef.current, {
      center: [47.63, -122.25], 
      zoom: 11,
      scrollWheelZoom: false,
    });

    // Voyager theme (very modern and clean, fits pure white / ice white aesthetics)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Custom electric blue marker style
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color: #007BFF; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const zones = [
      { name: "Seattle Hub", coords: [47.6062, -122.3321] as [number, number], radius: 10000 }, // 10km radius
      { name: "Bellevue Hub", coords: [47.6101, -122.2015] as [number, number], radius: 8000 },
      { name: "Redmond Hub", coords: [47.6740, -122.1215] as [number, number], radius: 8000 },
      { name: "Kirkland Hub", coords: [47.6786, -122.2054] as [number, number], radius: 8000 }
    ];

    zones.forEach(zone => {
      // Add marker
      const marker = L.marker(zone.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>${zone.name}</b><br/>Emerald Mobile Detailing Active Service Zone`);

      // Draw semi-transparent coverage circle
      L.circle(zone.coords, {
        color: '#007BFF',
        fillColor: '#007BFF',
        fillOpacity: 0.12,
        weight: 1.5,
        radius: zone.radius
      }).addTo(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />;
}
