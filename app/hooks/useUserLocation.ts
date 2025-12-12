"use client";

import { useEffect, useState } from "react";

interface Coordinates {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

export default function useUserLocation() {
  const [coords, setCoords] = useState<Coordinates>({
    lat: null,
    lng: null,
    accuracy: null
  });

  const [locationText, setLocationText] = useState("Detecting location...");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationText("Geolocation not supported");
      return;
    }

    setLocationText("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        setCoords({ lat, lng, accuracy });

        // ⭐ FAST Reverse Geocoding (Geoapify)
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`
          );

          const data = await res.json();
          const formatted = data?.features?.[0]?.properties?.formatted;

          setLocationText(formatted || "Unknown location");
        } catch {
          setLocationText("Unable to fetch address");
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setLocationText("Location permission denied");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return { coords, locationText, permissionDenied, detectLocation };
}
