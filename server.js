const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")

dotenv.config();

const app = express();

const db = require("./config/db");
db();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routes
const routes = require("./routes");
// const bodyParser = require("body-parser");
app.use("/api", routes);
app.use("/api/applications", require("./routes/jobApplication/jobApplicationRoutes"));


const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});