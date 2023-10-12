const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = process.env.ORIGIN_ACCESS
  ? process.env.ORIGIN_ACCESS.split(",")
  : [];

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use("/api/dress", require("./routes/dressRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/price", require("./routes/priceRoutes"));
app.use("/api/brand", require("./routes/brandRoutes"));
app.use("/api/color", require("./routes/colorRoutes"));
app.use("/api/rent", require("./routes/rentRoutes"));
app.use("/api/client", require("./routes/clientRoutes"));
app.use("/api/event", require("./routes/eventRoutes"));