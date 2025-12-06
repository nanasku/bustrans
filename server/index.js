const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/stations", require("./routes/stationRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

app.listen(5000, () => console.log("Backend running on port 5000"));