import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { siteURL } from "../static/Data";
import defaultImg from "../../public/Default_Img.jpg";
import { find30percent, find5percent, formatPrice } from "../static/Functions";
import Loading from "../components/Loading";

import FilterBar from "../components/FilterBar";
import { BiCartAdd, BiCartAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setOrder } from "../slices/productSlice";

const ProductDetails = () => {
  const [product, setProduct] = useState({
    productName: "",
    productPrice: 0,
    productDescription: "",
    productImage: "",
    seller: "",
  });
  const [error, setError] = useState("");
  const isAuthenticated =
    !!localStorage.getItem("token") && !!localStorage.getItem("userId");
  const userId = localStorage.getItem("userId");
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [contentLoading, setContentLoading] = useState<Boolean>(false);
  const [existing, setExisting] = useState<Boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      if (isAuthenticated) {
        axios
          .get(`${siteURL}/users/details/${userId}`)
          .then((res) => {
            setExisting(
              res.data.cart?.find((item: any) => item.productId === id)
            );
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    setContentLoading(true);
    axios
      .get(`${siteURL}/products/details/${id}`)
      .then((res) => {
        setContentLoading(false);
        if (res.data) {
          setProduct(res.data);
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => {
        setContentLoading(false);
        setError(err.response);
      });
  }, [id]);

  const handleBuyNow = () => {
    const orderData = {
      orderName: product.productName,
      totalPrice: formatPrice(
        product.productPrice - find30percent(product.productPrice)
      ),
      orderImage: product.productImage,
      savedPrice: formatPrice(find30percent(product.productPrice)),
      price30Percent: formatPrice(product.productPrice),
    };
    dispatch(setOrder(orderData));
    navigate("/checkout");
  };

  const handleAddToCart = async () => {
    try {
      if (isAuthenticated) {
        setLoading(true);
        axios
          .post(`${siteURL}/cart/${userId}/add`, { productId: id, ...product })
          .then(() => {
            setExisting(true);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      } else {
        setLoading(false);
        navigate("/mycart");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="theme">
      <FilterBar />

      <div className="lg:mx-6 p-4 mt-2 h-full min-h-[93.5vh]  md:min-h-[84.5vh] theme_container">
        <div className={`flex lg:flex-row flex-col `}>
          {/* left */}
          <div
            className={`lg:w-[37.3%] h-[65vh] w-full contents lg:flex flex-col  lg:sticky top-[4.5rem]`}
          >
            {contentLoading ? (
              <div className="flex h-full justify-center p-4 items-center text-red-500">
                <Loading />
              </div>
            ) : error ? (
              <div className="flex h-full justify-center p-4 items-center text-red-500">
                {error}
              </div>
            ) : (
              <>
                {" "}
                <div
                  className={`theme_border border-[1px] flex flex-col-reverse lg:flex-row h-[100%]`}
                >
                  <div
                    className={` lg:w-[15%] lg:border-r-[1px] theme_border lg:border-t-0 border-t-[1px]`}
                  >
                    <div className={`h-full p-6`}></div>
                  </div>
                  <div className=" lg:w-[85%] h-full p-4 justify-center items-center flex">
                    <img
                      src={product.productImage || defaultImg}
                      alt=""
                      className=" md:max-h-96 md:max-w-96 hover:shadow-rounded-sm  hover:scale-[1.008]"
                    />
                  </div>
                </div>
                <div className={`lg:ml-[4.7rem] flex gap-2 p-4`}>
                  <button
                    title="ADD TO CART"
                    className={`${
                      existing ? "bg-orange-400" : "theme_btn"
                    } w-3/6 py-2 px-4 text-sm text-white flex justify-center gap-2 items-center font-semibold`}
                    onClick={() => {
                      if (existing) navigate("/mycart");
                      else handleAddToCart();
                    }}
                  >
                    {loading ? (
                      <Loading width={20} height={20} color="white" />
                    ) : existing ? (
                      <BiCartAlt />
                    ) : (
                      <BiCartAdd />
                    )}

                    {loading ? "" : existing ? "GO TO CART" : "ADD TO CART"}
                  </button>
                  <button
                    title="BUY NOW"
                    className="w-3/6 py-2 px-4 text-white text-sm theme_btn font-semibold"
                    onClick={handleBuyNow}
                  >
                    BUY NOW
                  </button>
                </div>
              </>
            )}
          </div>

          {/* right */}
          <div
            className={`theme_container theme_text w-full lg:w-[62.3%] px-8`}
          >
            {contentLoading ? (
              <div className="flex h-full justify-center p-4  items-center text-red-500">
                <Loading />
              </div>
            ) : error ? (
              <div className="flex h-full justify-center p-4  items-center text-red-500">
                {error}
              </div>
            ) : (
              <div className="h-full">
                <div className="text-lg w-full"> {product.productName}</div>
                <div className="text-[12px] flex gap-4 py-2 text-gray-400 font-semibold">
                  <p className="bg-green-600 text-white w-[3rem] rounded-sm px-4  flex gap-2 justify-center items-center">
                    4.2
                    <i className="fa fa-star " aria-hidden="true"></i>
                  </p>
                  <p className="text-sm">37,446 Ratings & 1,758 Reviews</p>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  Extra {formatPrice(find5percent(product.productPrice))} off
                </div>
                <div className=" flex gap-4 items-center">
                  <span className="text-3xl font-bold ">
                    {formatPrice(product.productPrice)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(
                      product.productPrice + find30percent(product.productPrice)
                    )}
                  </span>
                  <span className="text-xl font-semibold text-green-600">
                    30% off
                  </span>
                </div>
                <div className="mt-4 gap-2 flex-col flex">
                  <span className="text-md font-bold ">Available offers</span>
                  <div className="text-sm">
                    <i
                      className="fa fa-tag text-green-600 mr-2"
                      aria-hidden="true"
                    ></i>
                    <span className="font-semibold">Bank Offer</span> Get ₹50
                    Instant Discount on first Zencart UPI transaction on order
                    of ₹200 and above{" "}
                    <span className="theme_color font-semibold">T&C</span>
                  </div>
                  <div className="text-sm">
                    <i
                      className="fa fa-tag text-green-600 mr-2"
                      aria-hidden="true"
                    ></i>
                    <span className="font-semibold">Bank Offer</span> 5%
                    Cashback on Zencart Axis Bank Card
                    <span className="theme_color font-semibold"> T&C</span>
                  </div>
                  <div className="text-sm">
                    <i
                      className="fa fa-tag text-green-600 mr-2"
                      aria-hidden="true"
                    ></i>
                    <span className="font-semibold">Special Price</span> Get
                    extra ₹5500 off (price inclusive of cashback/coupon)
                    <span className="theme_color font-semibold"> T&C</span>
                  </div>
                  <div className="text-sm">
                    <i
                      className="fa fa-tag text-green-600 mr-2"
                      aria-hidden="true"
                    ></i>
                    <span className="font-semibold">Partner Offer</span> Sign-up
                    for Zencart Pay Later & get free Times Prime Benefits worth
                    ₹20,000*
                    <span className="theme_color font-semibold"> T&C</span>
                  </div>
                </div>
                <div className="w-full mt-4 flex flex-col">
                  <span className="font-bold text-md">Seller</span>
                  {product.seller}
                </div>
                <div className="w-full mt-4 flex flex-col">
                  <span className="font-bold text-md">Description</span>
                  {product.productDescription}
                </div>
                <div className="w-full mt-4 flex flex-col">
                  <span className="font-bold text-md">Specification</span>
                  Dhanlaxmi Kirana Certified 128 GB) 4.3(8,308)
                  ₹10,685₹13,99923% off REDMI 12 (Pastel Blue, 128 GB)
                  4.2(48,166) ₹9,999₹15,99937% off REDMI 12 5G (Moonstone
                  Silver, 128 GB) 4.3(9,446) ₹11,999₹15,99925% off REDMI 12 5G
                  (Jade Black, 256 GB) 4.2(19,788) ₹13,999₹19,99930% off vivo
                  T3x 5G (Crimson Bliss, 128 GB) 4.5(8,323) ₹13,499₹17,49922%
                  off Bought together Selfie Sticks All Categories Screen Guards
                  Mobile Skin Stickers Plain Cases & Covers Designer Cases &
                  Covers Power Banks Hold up Wireless R1 Bluetooth Selfie Stick
                  IN INDIASAMSUNG E1282SONY XPERIA Z1 COMPACT PRICEVIDEOCONMI
                  MOBILE PRICEMOTO X PLAY 32GBOPPO F3+ PRICEXIAOMI REDMI
                  NOTESAMSUNG GALAXY JBUY SWIPE ELITE MAX ABOUT Contact Us About
                  Us Careers Zencart Stories Press Corporate Information GROUP
                  COMPANIES Myntra Cleartrip Shopsy HELP Payments Shipping
                  Cancellation & Returns FAQ Report Infringement CONSUMER POLICY
                  Cancellation & Returns Terms Of Use Security Privacy Sitemap
                  Grievance Redressal EPR Compliance Mail Us: Zencart Internet
                  Private Limited, Buildings Alyssa, Begonia & Clove Embassy
                  Tech Village, Outer Ring Road, Devarabeesanahalli Village,
                  Bengaluru, 560103, Karnataka, India Social Registered Office
                  Address: Zencart Internet Private Limited, Buildings Alyssa,
                  Begonia & Clove Embassy Tech Village, Outer Ring Road,
                  Devarabeesanahalli Village, Bengaluru, 560103, Karnataka,
                  India CIN : U51109KA2012PTC066107 Telephone: 044-45614700 /
                  044-67415800 Become a Seller Advertise Gift Cards Help Center
                  © 2007-2024 Zencart .com Price details Maximum Retail Price
                  (incl. of all taxes) ₹ 17999.00 Selling Price ₹ 17999.00
                  Special Price ₹ 12499.00
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
