const ip = require("ip")
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const { json } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res, next) {
    res.send("HOME");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${ip.address()}:${PORT}`);

});