const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app = express();
app.use(bodyParser.json());
app.use(cors());

const departmentRoute = require("./routes/department");
app.use(departmentRoute);
const categoryRoute = require("./routes/category");
app.use(categoryRoute)
const productRoute = require("./routes/product");
app.use(productRoute)
const reviewRoute = require("./routes/review");
app.use(reviewRoute)

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
