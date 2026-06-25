"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface ProjectMapProps {
  address: string;
  latitude?: string | number;
  longitude?: string | number;
}

export const ProjectMap: React.FC<ProjectMapProps> = ({ address, latitude, longitude }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse or fetch coordinates
  useEffect(() => {
    let active = true;

    const resolveCoords = async () => {
      // 1. If explicit lat/lng exist, use them
      if (latitude && longitude) {
        const lat = parseFloat(latitude.toString());
        const lng = parseFloat(longitude.toString());
        if (!isNaN(lat) && !isNaN(lng)) {
          if (active) {
            setCoords([lng, lat]);
            setLoading(false);
          }
          return;
        }
      }

      // 2. Otherwise geocode using OpenStreetMap Nominatim
      if (address) {
        try {
          const query = encodeURIComponent(`${address}, Chennai, Tamil Nadu, India`);
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
          const data = await res.json();
          if (active && data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCoords([lon, lat]);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      }

      // 3. Fallback to Chennai center if everything fails
      if (active) {
        setCoords([80.2707, 13.0827]); // [longitude, latitude]
        setLoading(false);
      }
    };

    resolveCoords();

    return () => {
      active = false;
    };
  }, [address, latitude, longitude]);

  // Render MapLibre Map
  useEffect(() => {
    if (!mapContainer.current || !coords) return;

    // Custom satellite style specification
    const satelliteStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        "esri-satellite": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          ],
          tileSize: 256,
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }
      },
      layers: [
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite",
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    // Initialize Map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteStyle,
      center: coords,
      zoom: 16, // Increase zoom slightly for satellite detail
      scrollZoom: false, // Prevent page scrolling hijacking
    });

    // Add Zoom and Rotation controls
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Create marker element matching design system (luxurious navy/gold theme)
    const el = document.createElement("div");
    el.className = "w-8 h-8 rounded-full bg-[#0B1117] border-2 border-white flex items-center justify-center shadow-xl cursor-pointer transition-transform duration-300 hover:scale-110";
    el.innerHTML = `<div class="w-3 h-3 rounded-full bg-[#38BDF8] animate-ping absolute"></div><div class="w-3 h-3 rounded-full bg-[#38BDF8] relative"></div>`;

    // Add Marker
    marker.current = new maplibregl.Marker({ element: el })
      .setLngLat(coords)
      .addTo(map.current);

    return () => {
      if (marker.current) marker.current.remove();
      if (map.current) map.current.remove();
    };
  }, [coords]);

  return (
    <div className="relative w-full h-full rounded-[24px] overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 gap-3">
          <div className="w-8 h-8 border-2 border-[#0B1117] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-widest">Locating Project...</span>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full min-h-[350px] md:min-h-[450px]" />
    </div>
  );
};
