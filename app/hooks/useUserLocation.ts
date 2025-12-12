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

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        setCoords({ lat, lng, accuracy });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          setLocationText(data.display_name || "Unknown location");
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
        timeout: 10000
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return { coords, locationText, permissionDenied, detectLocation };
}
