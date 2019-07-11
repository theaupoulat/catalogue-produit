const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const models = require("../schema.js");

const Department = models.department;
const Category = models.category;
const Product = models.product;
const Review = models.review;

// create category - FULL OK
router.post("/category/create", async (req, res) => {
	const title = req.body.title.toLowerCase();
	const description = req.body.description;
	const departmentKey = req.body.departmentKey;

	const filterTitle = await Category.find({ title: title });
	console.log(filterTitle[0]);

	const filterId = await Department.find({ _id: departmentKey });
	console.log(filterTitle);

	if (filterId[0] && filterTitle[0]) {
		res
			.status(400)
			.json({ error: { message: "You entered an invalid parameter" } });
	} else {
		const category = new Category({
			title: title,
			description: description,
			department: departmentKey
		});

		try {
			await category.save();
			res.json("You created a new Category");
		} catch (error) {
			res.status(400).json({ error: { message: "Bad Request" } });
		}
	}
});

// read category - FULL OK
router.get("/category", async (req, res) => {
	try {
		const results = await Category.find().populate("department");
		res.json(results);
	} catch (error) {
		res.status(400).json({ error: { message: "Bad Request" } });
	}
});

// update category - FULL OK
router.post("/category/update", async (req, res) => {
	const title = req.body.title.toLowerCase();
	const description = req.body.description;
	const newDepId = req.body.newDepId;
	const categoryId = req.query.id;

	try {
		const element = await Category.findById(categoryId);

		if (title) {
			element.title = title;
		}

		if (description) {
			element.description = description;
		}

		if (newDepId) {
			console.log("before newID");
			element.department = newDepId;
			console.log(" after new ID");
		}
		element.save();
		res.json(element);
	} catch (error) {}
});

// delete category and attached products - FULL OK
router.post("/category/delete", async (req, res) => {
	try {
		const catId = req.query.id;
		const category = await Category.findOne({ _id: catId }).remove();
		const products = await Product.find({ category: catId }).remove();
		res.json("Nice delete");
	} catch (error) {
		console.log(error.message);
	}
});

module.exports = router;
