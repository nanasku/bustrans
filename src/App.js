import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MapView from "./components/MapView";
import TicketGenerator from "./components/TicketGenerator";
import TicketScanner from "./components/TicketScanner";
import "./App.css";

function App() {
  const [currentStation, setCurrentStation] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDetectStation = useCallback((station) => {
    setCurrentStation(station);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/stations")
      .then(res => {
        setStations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stations:", err);
        setLoading(false);
        // Fallback data jika API error
        setStations([
          { id: 1, name: "Halte Senayan", code: "SEN", lat: -6.227, lng: 106.799 },
          { id: 2, name: "Halte Sudirman", code: "SUD", lat: -6.208, lng: 106.818 },
          { id: 3, name: "Halte Thamrin", code: "THA", lat: -6.185, lng: 106.823 },
          { id: 4, name: "Halte Kota", code: "KOT", lat: -6.135, lng: 106.813 }
        ]);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Memuat aplikasi...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: 10 }}>
        🚌 Aplikasi Pembayaran Bus
      </h1>

      <div style={{ margin: "20px 0", padding: 15, backgroundColor: "#f8f9fa", borderRadius: 8 }}>
        <h3>📍 Peta Rute Bus</h3>
        <MapView stations={stations} onDetectStation={handleDetectStation} />
      </div>

      <div style={{ 
        margin: "20px 0", 
        padding: 15, 
        backgroundColor: currentStation ? "#e8f5e9" : "#fff3cd",
        borderRadius: 8,
        border: `2px solid ${currentStation ? "#4CAF50" : "#ffc107"}`
      }}>
        <h3 style={{ color: currentStation ? "#2e7d32" : "#856404" }}>
          {currentStation ? "✅ " : "⚠️ "}
          Halte Terdeteksi: {currentStation ? currentStation.name : "Tidak ada halte terdekat"}
        </h3>
        {currentStation && (
          <p>Kode Halte: <strong>{currentStation.code}</strong></p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 30 }}>
        <div style={{ padding: 20, backgroundColor: "#e3f2fd", borderRadius: 8 }}>
          <TicketGenerator currentStation={currentStation} />
        </div>
        
        <div style={{ padding: 20, backgroundColor: "#f3e5f5", borderRadius: 8 }}>
          <TicketScanner currentStation={currentStation} />
        </div>
      </div>

      <div style={{ marginTop: 30, padding: 15, backgroundColor: "#f5f5f5", borderRadius: 8, fontSize: "14px" }}>
        <h4>📋 Petunjuk Penggunaan:</h4>
        <ol>
          <li>Izinkan akses lokasi saat diminta browser</li>
          <li>Tunggu hingga halte terdeteksi (marker hijau)</li>
          <li>Klik "Cetak Tiket" untuk membuat tiket baru</li>
          <li>Scan QR code tiket saat turun dari bus</li>
          <li>Bayar sesuai tarif yang muncul</li>
        </ol>
      </div>
    </div>
  );
}

export default App;