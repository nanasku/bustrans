const db = require("../db");

exports.getStations = (req, res) => {
    db.query("SELECT * FROM stations", (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
};
