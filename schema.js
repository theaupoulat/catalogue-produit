const mongoose = require("mongoose");

const Department = mongoose.model("Department", {
	title: String
});

const Category = mongoose.model("Category", {
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		maxlength: 150
	},
	department: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Department"
	}
});

const Product = mongoose.model("Product", {
	title: String,
	description: String,
	price: Number,
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category"
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	average_ratings: {
		type: Number,
		min: 0,
		max: 5
	}
});

const Review = mongoose.model("Review", {
	rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	comment: {
		type: String,
		minlength: 0,
		maxlength: 150,
		trim: true,
		required: true
	},
	username: {
		type: String,
		minlength: 3,
		maxlength: 15,
		trim: true,
		required: true
	}
});

module.exports = {
	department: Department,
	category: Category,
	product: Product,
	review: Review
};
