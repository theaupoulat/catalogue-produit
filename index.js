const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app = express();
app.use(bodyParser.json());
app.use(cors());

const departmentRoute = require("./routes/department");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const reviewRoute = require("./routes/review");

mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/catalogue-produit",
	{
		useNewUrlParser: true
	}
);

/* REST */

app.all("*", (req, res) => {
	res.send("all routes");
});

app.listen(3000, () => {
	console.log("Server Started");
});
