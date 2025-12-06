import React from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

export default function TicketGenerator({ currentStation }) {
  const [ticketData, setTicketData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const generateTicket = async () => {
    if (!currentStation) return alert("Anda tidak berada di halte");

    setLoading(true);
    
    try {
      const ticketCode = "TIC" + Date.now();

      const res = await axios.post("http://localhost:5000/api/tickets/create", {
        ticketCode,
        startStation: currentStation.code
      });

      setTicketData(res.data);
    } catch (error) {
      console.error("Error generating ticket:", error);
      alert("Gagal membuat tiket. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Cetak Tiket</h3>
      <button 
        onClick={generateTicket}
        disabled={loading || !currentStation}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: currentStation ? "#4CAF50" : "#cccccc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: currentStation ? "pointer" : "not-allowed"
        }}
      >
        {loading ? "Membuat Tiket..." : "Cetak Tiket"}
      </button>

      {ticketData && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <QRCodeSVG value={JSON.stringify(ticketData)} size={150} />
          <p style={{ marginTop: 10, fontSize: "12px" }}>
            Kode: {ticketData.ticketCode} | Halte: {ticketData.startStation}
          </p>
        </div>
      )}
    </div>
  );
}