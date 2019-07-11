const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const models = require("../schema.js");

const Department = models.department;
const Category = models.category;
const Product = models.product;
const Review = models.review;

app.post("/department/create", async (req, res) => {
	const title = req.body.title.toLowerCase();
	const result = new Department({
		title: title
	});

	const filter = await Department.find({ title: title });
	console.log(filter);

	if (filter.length === 0) {
		try {
			await result.save();
			res.json({ message: `You created the ${title} department` });
		} catch (error) {
			res.status(400).json({ error: { message: "Bad Request" } });
		}
	} else {
		res.status(400).json({
			error: {
				message: "You are trying to create a Department that already exists"
			}
		});
	}
});

// read Departments - FULL OK
app.get("/department", async (req, res) => {
	try {
		const result = await Department.find();
		res.json(result);
	} catch (error) {
		res.status(400).json({
			error: {
				message: "Bad Request"
			}
		});
	}
});

// update Department - FULL OK
app.post("/department/update", async (req, res) => {
	const depId = req.query.id;
	const title = req.body.title.toLowerCase();

	console.log(depId, title);
	try {
		let department = await Department.findById(depId);
		console.log(department);
		department.title = title;
		await department.save();
		res.json("Department updated");
	} catch (error) {
		res.status(400).json({ error: { messge: "Department not found" } });
	}
});

// delete Department and attached products and categories - FULL OK
app.post("/department/delete", async (req, res) => {
	const depId = req.query.id;

	try {
		console.log("Before getting dep");
		const department = await Department.findOne({ _id: depId }).remove();
		console.log(department);
		console.log("before getting matching categories");
		const categories = await Category.find({ department: depId });
		console.log(categories);

		let catIds = [];

		for (let i = 0; i < categories.length; i++) {
			const element = categories[i]._id;

			if (!catIds.includes(element)) {
				catIds.push(element);
			}
		}
		await Category.find({ department: depId }).remove();
		console.log(catIds);
		console.log("Before getting all products with category of THE department");
		await Product.find({ category: { $in: catIds } }).remove();

		/* for (let j = 0; j < products.length; j++) {
			await array[j].remove();
		} */

		res.json("This is the end");

		/* await department.remove( (err, department) => {
			console.log("In the callback");
			const category = await Category.find({
				department: department._id
			});
			console.log(category);
			for (let el of category) {
				let catId = category[el].category;
				const products = await Product.find({ category: catId });
				for (el of products) {
				}
			}
			category.remove(async (err, category) => {});
		}); */
	} catch (error) {}
});
