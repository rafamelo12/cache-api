const Product = require('../models/Product');
const randomString = require('randomstring');
const cacheMaxSize = process.env.CACHE_MAX_SIZE || 5;

module.exports = {
	getItem(req, res) {
		let key = req.params.key;
		if (!key) {
			res.status(400).send('Please, provide a key');
		} else {

		}
		Product.findOne({key: key}, (err, product) => {
			if (err) {
				res.status(500).send(err);
			}
			else {
				if (product) {
					console.log('Cache hit!');
					product.set({
						dummyData: randomString.generate(),
						TTL: Date.now()
					});
					product.save((err, updatedProduct) => {
						if (err) {
							res.status(500).send(err);
						} else {
							res.send({
								dummyData: product.dummyData
							});
						}
					});
				} else {
					console.log('Cache miss!');
					Product.count({}, (err, count) => {
						if (err) {
							res.status(500).send(err);
						} else {
							if (count < cacheMaxSize) {
								Product.create({
									key: key,
									dummyData: randomString.generate()
								}, (err, product) => {
									if (err) {
										res.status(500).send(err);
									} else {
										res.send({dummyData: product.dummyData});
									}
								});
							} else {
								Product.findOne({}, {}, { sort: { 'TTL': 1 } }, (err, product) => {
									Product.remove({_id: product._id}, (err) => {
										if (err) {
											res.status(500).send(err);
										} else {
											Product.create({
												key: key,
												dummyData: randomString.generate()
											}, (err, product) => {
												if (err) {
													res.status(500).send(err);
												} else {
													res.send({dummyData: product.dummyData});
												}
											});
										}
									})
								})
							}
						}
					});
				}
			}
		});
	},

	getAllItems(req, res) {
		Product.find({}, 'dummyData TTL', (err, products) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.send(products);
			}
		});
	},

	deleteItem(req, res) {
		let key = req.params.key
		if (!key) {
			res.status(400).send('Please, provide a key!');
		} else {
			Product.remove({key: key}, err => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.send();
				}
			});
		}
	},

	deleteAllitems(req, res) {
		Product.remove({}, err => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.send();
			}
		});
	}
}