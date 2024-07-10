// import { Link } from "react-router-dom";
import Default_Img from "../../public/Default_Img.jpg";
const ProductCard = ({ category }: any) => {
  return (
    <div
      className={`theme_border border-[1px] product_card flex flex-col justify-center shadow-sm items-center cursor-pointer rounded-sm p-4`}
    >
      <img
        src={Default_Img}
        alt="Product Preview"
        className="rounded-sm p-4 "
        style={{ width: "150px", height: "150px" }}
      />
      <div className="theme_color text-md font-bold pt-2">{category}</div>
      {/* {showOptions && (
        <div className="flex justify-between">
          <Link
            to={`/products/${product._id}`}
            className="text-blue-600 hover:underline"
          >
            <i className="fas fa-eye mr-1"></i> View
          </Link>
          <Link
            to={`/products/edit/${product._id}`}
            className="text-yellow-600 hover:underline"
          >
            <i className="fas fa-edit mr-1"></i> Edit
          </Link>
          <button
            title="Delete"
            onClick={() => onDeleteClick(product._id)}
            className="text-red-600 hover:underline"
          >
            <i className="fas fa-trash-alt mr-1"></i> Delete
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ProductCard;
