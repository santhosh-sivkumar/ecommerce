import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import axios from "axios";
// import { setProducts } from "../slices/productSlice";
import ProductCard from "../components/ProductCard";
import { siteURL } from "../static/Data";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { HomePageImages } from "../static/Data";
import Carousel from "../components/HomePage/Carousel";
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  // const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${siteURL}/products/categories`)
      .then((response: any) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className={`theme min-h-[100vh] space-y-4 p-4 `}>
      <div
        className={`w-full gap-12 overflow-scroll flex theme_container justify-center items-center font-semibold h-32 shadow-sm rounded-sm`}
      >
        {HomePageImages.map((item: any, index: any) => {
          return (
            <a
              key={index}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <img src={item.img} alt={item.title} className="w-20 h-20" />
              <p className="text-sm theme_text">{item.title}</p>
            </a>
          );
        })}
      </div>
      <Carousel />

      <div
        className={`theme_container justify-center flex p-0 lg:p-4 shadow-none lg:shadow-md rounded-sm`}
      >
        <div
          className={`relative grid justify-center items-center grid-cols-1 p-0 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4  rounded-sm `}
        >
          {categories?.length > 0 ? (
            categories.map((category: any, index: number) => (
              <Link to={`/products/collection/${category}`} key={index}>
                <ProductCard category={category} />
              </Link>
            ))
          ) : loading ? (
            <div className="absolute inset-0 flex gap-2 flex-col items-center justify-center theme_container  z-10">
              <Loading />
            </div>
          ) : (
            <p className="text-2xl text-red-400">No data found</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
