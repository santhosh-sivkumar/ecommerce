import express from "express";
import { Product } from "../models/Product.js";
import multer from "multer";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const categoriesWithImages = [];
    for (const category of categories) {
      const product = await Product.findOne({ category });
      let categoryImage = null;
      if (product) {
        categoryImage = product.productImage;
      }
      categoriesWithImages.push({
        categoryName: category,
        categoryImage,
      });
    }
    res.status(200).json(categoriesWithImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for saving a New Product - CREATE
router.post("/create", async (request, response) => {
  try {
    const { productName, productDescription, productPrice, productImage } =
      request.body;

    if (!productName || !productDescription || !productPrice || !productImage) {
      return response.status(400).send({
        message:
          "Send all required fields: productName, productDescription, productPrice, productImage",
      });
    }
    const product = await Product.create(request.body);
    return response.status(201).send(product);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Route to get all Products - READ ALL
router.get("/", async (request, response) => {
  try {
    let query = {};
    const { category } = request.query;

    if (category) {
      query = { category };
    }
    const products = await Product.find(query);
    return response.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});

// Route to get a single Product - READ
router.get("/details/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id);
    return response.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});
// Route to get a Products on search - READ
router.get("/suggestions", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json([]);
  }

  try {
    const products = await Product.find({
      productName: { $regex: query, $options: "i" },
    }).limit(5);

    res.status(200).send(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product suggestions", error });
  }
});

// Route to update a product - UPDATE
router.put("/update/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { productName, productDescription, productPrice, productImage } =
      request.body;

    if (!productName || !productDescription || !productPrice || !productImage) {
      return response
        .status(400)
        .send({ message: "Please provide all the required fields." });
    }
    const result = await Product.findByIdAndUpdate(id, request.body, {
      new: true,
    });
    if (!result) {
      return response.status(404).send({
        message: "Product not found",
      });
    }

    return response
      .status(200)
      .send({ message: "Product updated successfully", product: result });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});

router.delete("/delete/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).send({
        message: "Product not found",
      });
    }

    return response.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});

export default router;
