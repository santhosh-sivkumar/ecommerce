import express from "express";
import { ProductModel } from "../models/productModel.js";
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

// Route for saving a New Product - CREATE
router.post(
  "/create",
  upload.single("productImage"),
  async (request, response) => {
    try {
      const { productName, productDescription, productPrice } = request.body;
      const productImage = request.file ? request.file.path : undefined; // Path to uploaded file

      if (
        !productName ||
        !productDescription ||
        !productPrice ||
        !productImage
      ) {
        return response.status(400).send({
          message:
            "Send all required fields: productName, productDescription, productPrice, productImage",
        });
      }

      const newProduct = {
        productName,
        productDescription,
        productPrice,
        productImage,
      };

      const product = await ProductModel.create(newProduct);
      return response.status(201).send(product);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  }
);

// Route to get all Products - READ ALL
router.get("/", async (request, response) => {
  try {
    const products = await ProductModel.find({});
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
    const product = await ProductModel.findById(id);
    return response.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({
      message: error.message,
    });
  }
});

// Route to update a product - UPDATE
router.put(
  "/edit/:id",
  upload.single("productImage"),
  async (request, response) => {
    try {
      const { id } = request.params;
      const { productName, productDescription, productPrice } = request.body;
      const productImage = request.file ? request.file.path : undefined; // Updated product image if file uploaded

      if (!productName || !productDescription || !productPrice) {
        return response
          .status(400)
          .send({ message: "Please provide all the required fields." });
      }

      const updatedProduct = {
        productName,
        productDescription,
        productPrice,
        productImage,
      };

      const result = await ProductModel.findByIdAndUpdate(id, updatedProduct, {
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
  }
);

// Route to delete a product - DELETE
router.delete("/delete/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await ProductModel.findByIdAndDelete(id);

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
