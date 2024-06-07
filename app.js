const express = require("express");
const authRoutes = require("./routes/authRoutes");
const companiesRoute = require("./routes/companiesRoutes.js");
const employeesRoute = require("./routes/employeeRoutes.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:3000", "https://crud-client-rho.vercel.app"],
  credentials: true,
};

const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/storage", express.static(__dirname + "/storage"));

// Routes section
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoute);
app.use("/api/employees", employeesRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
