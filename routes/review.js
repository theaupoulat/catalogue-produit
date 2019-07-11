const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const models = require("../schema.js");

const Department = models.department;
const Category = models.category;
const Product = models.product;
const Review = models.review;

// create a review, that updates the product rating and reviews - BASIC OK
app.post("/review/create", async (req, res) => {
	const productId = req.body.productId;
	const rating = req.body.rating;
	const comment = req.body.comment;
	const username = req.body.username;

	const review = new Review({
		rating: rating,
		comment: comment,
		username: username
	});

	const savedReview = await review.save();

	const product = await Product.findOne({ _id: productId });

	product["reviews"].push(savedReview._id);
	await product.save();

	// recalculating rating - REFACTO ?
	const productForAvg = await Product.findOne({ _id: productId }).populate(
		"reviews"
	);

	let averageRating = 0;

	for (let i = 0; i < productForAvg.reviews.length; i++) {
		const element = productForAvg.reviews[i].rating;
		console.log(element);
		averageRating += element;
	}

	averageRating = averageRating / productForAvg.reviews.length;
	productForAvg.average_ratings = averageRating;
	await productForAvg.save();
	res.json("Created");
});

// update a review with update on the product rating if needed - BASIC OK
app.post("/review/update", async (req, res) => {
	const reviewId = req.query.id;
	const rating = req.body.rating;
	const comment = req.body.comment;

	const review = await Review.findOne({ _id: reviewId });
	console.log(review);

	if (comment) {
		review.comment = comment;
		await review.save();
	}
	if (rating) {
		review.rating = rating;
		await review.save();

		// recalculating rating - REFACTO ?
		const productForAvg = await Product.findOne({
			reviews: { $in: [reviewId] }
		}).populate("reviews");

		let averageRating = 0;

		for (let i = 0; i < productForAvg.reviews.length; i++) {
			const element = productForAvg.reviews[i].rating;
			console.log(element);
			averageRating += element;
		}

		averageRating = averageRating / productForAvg.reviews.length;
		productForAvg.average_ratings = averageRating;
		await productForAvg.save();
	}
	res.json("Updated");
});

//delete review - BASIC OK
app.post("/review/delete", async (req, res) => {
	const reviewId = req.query.id;
	console.log("I am here");

	const review = await Review.findOne({ _id: reviewId });
	// await review.remove();

	const product = await Product.findOne({
		reviews: { $in: [reviewId] }
	});
	const rev = product.reviews.indexOf(reviewId);
	product.reviews.splice(rev, 1);
	await product.save();

	// recalculating rating - REFACTO ?
	const productForAvg = await Product.findOne({
		reviews: { $in: [reviewId] }
	}).populate("reviews");

	let averageRating = 0;

	for (let i = 0; i < productForAvg.reviews.length; i++) {
		const element = productForAvg.reviews[i].rating;
		console.log(element);
		averageRating += element;
	}

	averageRating = averageRating / productForAvg.reviews.length;
	productForAvg.average_ratings = averageRating;
	await productForAvg.save();

	res.json("Deleted");

	//delete from product and recalculate
});
