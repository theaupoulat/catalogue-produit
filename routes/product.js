const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const models = require("../schema.js");

const Department = models.department;
const Category = models.category;
const Product = models.product;
const Review = models.review;

// create products - FULL OK
app.post("/product/create", async (req, res) => {
	const title = req.body.title.toLowerCase();
	const description = req.body.description;
	const price = req.body.price;
	const category = req.body.category;

	const filterTitle = await Product.findOne({ title: title });
	console.log(filterTitle);

	const filterCategory = await Category.findOne({ _id: category });
	console.log(filterCategory);

	if (!filterTitle && filterCategory) {
		try {
			const product = new Product({
				title: title,
				description: description,
				price: price,
				category: category
			});
			await product.save();
			res.json({
				message: "You successfully created a new product",
				product: product
			});
		} catch (error) {
			res
				.status(400)
				.json({ error: { message: "FAILURE SAVING - DB PROBLEM" } });
		}
	} else {
		res.status(400).json({ error: { message: "Invalid Parameters" } });
	}
});

// read products - FULL OK
app.get("/product", async (req, res) => {
	const category = req.query.category;
	const title = req.query.title; // Regex Builder Needed
	const page = Number(req.query.page);
	const priceMin = Number(req.query.priceMin);
	const priceMax = Number(req.query.priceMax);
	const sort = req.query.sort;

	const filters = {};
	let indexStart = page * 20 - 20;
	const displayedProducts = 20;
	// page -1 * 20 = debut de page
	// end of slice = debut + 20

	if (category) {
		// ok
		filters.category = category;
	}
	if (title) {
		// ok
		console.log("I am here");
		regex = new RegExp(title, "i");

		filters["title"] = { $regex: regex, $options: "i" };
		console.log("I am finished here");
	}
	if (priceMin && priceMax) {
		// ok
		filters.price = { $lte: priceMax, $gte: priceMin };
	} else {
		if (priceMin) {
			// ok
			filters.price = { $gte: priceMin };
		}
		if (priceMax) {
			// ok
			filters.price = { $lte: priceMax };
		}
	}

	try {
		let allProducts;
		if (sort) {
			// ok
			if (sort === "price-asc") {
				allProducts = await Product.find(filters)
					.populate("category")
					.populate("reviews")
					.sort({ price: 1 })
					.skip(indexStart)
					.limit(displayedProducts);
			} else if (sort === "price-desc") {
				allProducts = await Product.find(filters)
					.populate("category")
					.populate("reviews")
					.sort({ price: -1 })
					.skip(indexStart)
					.limit(displayedProducts);
			} else {
				res
					.status(400)
					.json({ error: { message: "Bad input to sort parameter" } });
			}
		} else {
			allProducts = await Product.find(filters)
				.populate("category")
				.populate("reviews")
				.skip(indexStart)
				.limit(displayedProducts);
		}
		if (page) {
			res.json(allProducts);
		} else {
			res.json(allProducts);
		}
	} catch (error) {
		res.status(400).json({ error: { message: "Bad Request" } });
	}
});

// update products - FULL OK
app.post("/product/update", async (req, res) => {
	const title = req.body.title;
	const description = req.body.description;
	const price = req.body.price;
	const newCat = req.body.newCat;

	const product = await Product.findOne({ _id: req.query.id });

	if (product) {
		try {
			if (title) {
				product.title = title;
			}
			if (description) {
				product.description = description;
			}
			if (price) {
				product.price = price;
			}
			if (newCat) {
				product.category = newCat;
			}
			await product.save();
			res.json(product);
		} catch (error) {
			res.status(400).json("Problem here");
		}
	}
});

// delete products - FULL OK
app.post("/product/delete", async (req, res) => {
	const product = await Product.findOne({ _id: req.query.id });
	if (product) {
		await product.remove();
		res.json("Deleted successfully");
	} else {
		res.status(400).json({ error: { message: "Product not found" } });
	}
});
