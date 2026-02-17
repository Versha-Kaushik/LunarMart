import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = req.query.pageSize || req.query.limit ? Number(req.query.pageSize || req.query.limit) : 20;
    const page = Number(req.query.pageNumber) || 1;
    const skip = req.query.skip ? Number(req.query.skip) : pageSize * (page - 1);

    const keyword = req.query.keyword && req.query.keyword.trim() !== ''
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const userFilter = req.query.userId ? { user: req.query.userId } : {};
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...userFilter, ...categoryFilter };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(skip);

    res.json({ products, page, pages: Math.ceil(count / pageSize), totalProducts: count });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
        colors,
    } = req.body;

    const product = new Product({
        name: name || 'Unnamed Product',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        brand: brand || 'Generic',
        category: category || 'Uncategorized',
        countInStock: countInStock || 0,
        numReviews: 0,
        description: description || 'No description provided',
        colors: colors || [],
    });

    try {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(400);
        throw new Error(`Invalid product data: ${error.message}`);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        colors,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        product.colors = colors || [];

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!req.user) {
        res.status(401);
        throw new Error('User not found in request');
    }

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            image,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const deleteProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.find(
            (r) => r._id.toString() === req.params.reviewId
        );

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to delete this review');
        }

        product.reviews = product.reviews.filter(
            (r) => r._id.toString() !== req.params.reviewId
        );

        product.numReviews = product.reviews.length;

        if (product.numReviews > 0) {
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.json({ message: 'Review deleted' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview,
    getTopProducts,
};
