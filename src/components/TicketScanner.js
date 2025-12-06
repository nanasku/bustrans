import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function TicketScanner({ currentStation }) {
  const [fare, setFare] = useState(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!currentStation) return;

    // Clean up previous scanner
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Scan result: ${decodedText}`);
      
      try {
        const ticket = JSON.parse(decodedText);
        const startStation = ticket.startStation;
        const endStation = currentStation?.code;

        axios.post("http://localhost:5000/api/tickets/fare", {
          startStation,
          endStation
        })
        .then(res => {
          setFare(res.data.price);
          setScanning(false);
        })
        .catch(err => {
          console.error("Error calculating fare:", err);
          alert("Error calculating fare. Please try again.");
        });

      } catch (error) {
        console.error("Error parsing QR code:", error);
        alert("Invalid QR code. Please scan a valid ticket.");
      }
    }

    function onScanFailure(error) {
      // Handle scan failure
      console.warn(`QR scan error: ${error}`);
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },
      false
    );
    
    scannerRef.current = html5QrcodeScanner;
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [currentStation]);

  const restartScan = () => {
    setFare(null);
    setScanning(true);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Scan Tiket</h3>
      
      {scanning ? (
        <div id="qr-reader" style={{ width: "100%", maxWidth: 500 }}></div>
      ) : (
        <div>
          <button onClick={restartScan} style={{ marginBottom: 20 }}>
            Scan Tiket Lain
          </button>
        </div>
      )}
      
      {fare && (
        <div style={{ marginTop: 20, padding: 15, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
          <h2>Total Bayar: Rp {fare.toLocaleString()}</h2>
        </div>
      )}
    </div>
  );
}