const db = require("../db");

// Generate Ticket
exports.createTicket = (req, res) => {
    const { startStation, ticketCode } = req.body;

    const sql = "INSERT INTO tickets (ticket_code, start_station, start_time) VALUES (?, ?, NOW())";
    db.query(sql, [ticketCode, startStation], (err, result) => {
        if (err) throw err;

        res.json({
            success: true,
            ticketCode,
            startStation
        });
    });
};

// Calculate Fare
exports.calculateFare = (req, res) => {
    const { startStation, endStation } = req.body;

    const sql = "SELECT price FROM fares WHERE from_station = ? AND to_station = ?";
    db.query(sql, [startStation, endStation], (err, rows) => {
        if (err) throw err;

        if (rows.length === 0) {
            return res.json({ success: false, message: "Tarif tidak ditemukan" });
        }

        res.json({
            success: true,
            price: rows[0].price
        });
    });
};
