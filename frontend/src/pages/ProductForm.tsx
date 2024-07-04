import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { domainURL } from "../static";
import { GetImageURL } from "../GetImageURL";

const ProductForm = ({ mode }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    category: "",
    company: "",
    seller: "",
    productImage: "", // Assuming productImage is a URL or path
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold image preview URL
  const [fileLabel, setFileLabel] = useState<string>("Choose New"); // Default label for file input

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`${domainURL}/products/details/${id}`)
        .then((response) => {
          const {
            productName,
            productDescription,
            productPrice,
            productImage,
            category,
            company,
            seller,
          } = response.data;
          setProduct({
            productName,
            productDescription,
            productPrice,
            productImage,
            category,
            company,
            seller,
          });
          if (productImage) {
            setImagePreview(GetImageURL(productImage)); // Convert image path for preview
            setFileLabel(getFileName(productImage)); // Get file name for display
          }
        })
        .catch((error) => console.log(error));
    }
  }, [mode, id]);

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setProduct((prevState) => ({
      ...prevState,
      productImage: file,
    }));

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
      setFileLabel(file.name); // Set file name for display
    } else {
      setImagePreview(null);
      setFileLabel("Choose New");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "create") {
      axios
        .post(`${domainURL}/products/create`, product, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setLoading(false);
          navigate("/");
        })
        .catch((error) => console.log(error.response.data.message));
    } else if (mode === "edit" && id) {
      axios
        .put(`${domainURL}/products/edit/${id}`, product, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setLoading(false);
          navigate("/");
          console.log("Product updated");
        })
        .catch((error) => console.log(error.response.data.message));
    }
  };

  // Function to get file name from path or URL
  const getFileName = (path: string) => {
    const pathParts = path.split("-");
    console.log(pathParts);
    return pathParts[pathParts.length - 1]; // Return last part of the path as file name
  };

  return (
    <div className="flex min-h-[100vh] items-center flex-col gap-4 theme theme_color py-4">
      <h1 className="text-3xl font-bold theme_text">
        {mode === "create" ? "Create Product" : "Edit Product"}
      </h1>
      <form
        className="lg:w-[65vw] w-[90vw] flex-col justify-center items-center theme_container shadow-md rounded-md p-4"
        onSubmit={handleSubmit}
      >
        <div className=" mb-4 rounded-md p-4 theme  flex justify-center items-center flex-col ">
          <label
            className="block  text-sm font-bold mb-2"
            htmlFor="productImage"
          >
            Product Image
          </label>
          <div className="flex justify-center items-center lg:flex-row gap-4 flex-col">
            <label className="max-w-[8.5rem] py-2 px-4 border border-gray-300 rounded-md cursor-pointer bg-white  hover:bg-gray-100">
              <div className="flex gap-4 items-center justify-center">
                <span className="block text-center text-black bg-gray-200 border-black border-[1px] text-sm py-1 px-2">
                  {product.productImage ? "Choose New" : "Choose File"}
                </span>
              </div>
              <input
                type="file"
                name="productImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex flex-col justify-center items-center gap-4 text-md">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="mt-2 rounded-md border-[1px] p-1 border-gray-400"
                  style={{ maxWidth: "50%", maxHeight: "200px" }}
                />
              )}
              <span className="theme_color">{fileLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-0 md:gap-2">
          <div className="theme rounded-md md:rounded-b-md rounded-b-none p-4 sm:pb-0 md:p-4 md:w-1/2 md:mb-4">
            <div className="mb-4">
              <label
                className="block  text-sm font-bold mb-2"
                htmlFor="productName"
              >
                Product Name
              </label>
              <input
                value={product.productName}
                type="text"
                name="productName"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Product Name"
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block  text-sm font-bold mb-2"
                htmlFor="productDescription"
              >
                Product Description
              </label>
              <input
                value={product.productDescription}
                type="textarea"
                name="productDescription"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Product Description"
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block  text-sm font-bold mb-2"
                htmlFor="productPrice"
              >
                Product Price
              </label>
              <input
                value={product.productPrice}
                type="number"
                name="productPrice"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Product Price"
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="theme rounded-md md:rounded-t-md rounded-t-none p-4 sm:pt-0 md:p-4 md:w-1/2 mb-4">
            <div className="mb-4">
              <label
                className="block  text-sm font-bold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <input
                value={product.category}
                type="text"
                name="category"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Category"
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block  text-sm font-bold mb-2"
                htmlFor="company"
              >
                Company
              </label>
              <input
                value={product.company}
                type="text"
                name="company"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Company"
                onChange={handleOnChange}
              />
            </div>
            <div className="mb-4">
              <label className="block  text-sm font-bold mb-2" htmlFor="seller">
                Seller Name
              </label>
              <input
                value={product.seller}
                type="text"
                name="seller"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dynamic"
                placeholder="Seller"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition duration-300"
        >
          <i className="fas fa-save mr-2"></i>
          {loading
            ? "Processing"
            : mode === "create"
            ? "Create Product"
            : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
