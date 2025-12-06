import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapView({ stations, onDetectStation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const busMarkerRef = useRef(null);

  const handleStationDetection = useCallback((nearest) => {
    if (onDetectStation) {
      onDetectStation(nearest);
    }
  }, [onDetectStation]);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current) {
      const map = L.map("map").setView([-6.2, 106.8], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add station markers
      stations.forEach(st => {
        const marker = L.marker([st.lat, st.lng])
          .addTo(map)
          .bindPopup(`<b>${st.name}</b><br>Kode: ${st.code}`);
        markersRef.current.push(marker);
      });
    }

    // Set up geolocation tracking
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Update or create bus marker
          if (busMarkerRef.current) {
            busMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const busIcon = L.divIcon({
              html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
              className: 'bus-marker',
              iconSize: [24, 24]
            });
            
            busMarkerRef.current = L.marker([lat, lng], { icon: busIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup("Bus Anda");
          }

          // Find nearest station
          let nearest = null;
          let minDistance = Infinity;

          stations.forEach(st => {
            const dist = getDistance(lat, lng, st.lat, st.lng);
            if (dist < 50 && dist < minDistance) {
              minDistance = dist;
              nearest = st;
            }
          });

          handleStationDetection(nearest);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );

      // Cleanup function
      return () => {
        navigator.geolocation.clearWatch(watchId);
        
        // Remove markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        if (busMarkerRef.current) {
          busMarkerRef.current.remove();
          busMarkerRef.current = null;
        }
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, handleStationDetection]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div id="map" style={{ height: "400px", width: "100%", marginBottom: "20px", borderRadius: "8px" }} />;
}