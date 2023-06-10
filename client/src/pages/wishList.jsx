import React, { useEffect, useState } from "react";
import { useStateProvider } from "../context/StateContext";
import { BsTrash3 } from "react-icons/bs";
import { API_URL, IMAGES_URL } from "../utils/constants";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import PopularGigCarousel from "../components/Carousel/PopularGigCarousel";
import Spiner from "../components/spiner/Spiner";

function wishList() {
  const [{ wishList }, dispatch] = useStateProvider();
  const [cookies] = useCookies();
  const router = useRouter();
   const [loading, setLoading] = useState(false);

  const handleRemove = async (id) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/wishList/user-delete-wishList/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      if (data) {
        toast.success("Gig deleted wish list  successfully");
      }
      getUserWishList();
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  useEffect(() => {
    getUserWishList();
  }, [router.pathname]);

  const getUserWishList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/wishList/user-get-wishList`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      dispatch({ type: "ADD_GIG_WISH_LIST", payload: data });
      setLoading(false );
    } catch (error) {
      setLoading(false );
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  return loading ? (
    <Spiner />
  ) : (
    <>
      <div className=" relative container">
        <div className="m-0 p-0 b-0 outline-0 ">
          <section className="px-9">
            <div className="max-w-[1400px] m-auto">
              <section className="pb-8 flex flex-col">
                <div>
                  {wishList.length > 0 && (
                  <section className="pt-0 pb-0 ml-[24px] h-[38px] float-right items-center flex">
                    <h5 className=" font-mono text-[#1dbf73]">
                      Gigs ({wishList?.length})
                    </h5>
                  </section>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h2 className=" mr-6 leading-9 text-[32px] font-bold text-[#404145]">
                        {" "}
                        My favorites list
                      </h2>
                      <div className="relative inline-flex ">
                        <span className="inline-flex box-border">
                          <div
                            className="text-[14px] flex text-slate-400"
                            delay="120"
                            content="[object Object]"
                            position="top"
                          >
                            <span
                              className=" inline-block bg-none border-none p-0 m-0  fill-[#b5b6ba] mr-[8px]"
                              aria-hidden="true"
                              style={{ width: "16px;", height: "16px;" }}
                            >
                              <svg
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M12.5 7C12.9062 7 13.25 7.15625 13.5625 7.4375C13.8438 7.75 14 8.09375 14 8.5V14.5C14 14.9375 13.8438 15.2812 13.5625 15.5625C13.25 15.875 12.9062 16 12.5 16H1.5C1.0625 16 0.71875 15.875 0.4375 15.5625C0.125 15.2812 0 14.9375 0 14.5V8.5C0 8.09375 0.125 7.75 0.4375 7.4375C0.71875 7.15625 1.0625 7 1.5 7H2.25V4.75C2.25 3.90625 2.4375 3.125 2.875 2.375C3.3125 1.65625 3.875 1.09375 4.625 0.65625C5.34375 0.21875 6.125 0 7 0C7.84375 0 8.625 0.21875 9.375 0.65625C10.0938 1.09375 10.6562 1.65625 11.0938 2.375C11.5312 3.125 11.75 3.90625 11.75 4.75V7H12.5ZM8.25 12.25V10.75C8.25 10.4062 8.125 10.125 7.875 9.875C7.625 9.625 7.34375 9.5 7 9.5C6.625 9.5 6.34375 9.625 6.09375 9.875C5.84375 10.125 5.75 10.4062 5.75 10.75V12.25C5.75 12.625 5.84375 12.9062 6.09375 13.1562C6.34375 13.4062 6.625 13.5 7 13.5C7.34375 13.5 7.625 13.4062 7.875 13.1562C8.125 12.9062 8.25 12.625 8.25 12.25ZM9.25 7V4.75C9.25 4.125 9.03125 3.59375 8.59375 3.15625C8.15625 2.71875 7.625 2.5 7 2.5C6.375 2.5 5.84375 2.71875 5.40625 3.15625C4.96875 3.59375 4.75 4.125 4.75 4.75V7H9.25Z"></path>
                              </svg>
                            </span>
                            <span className="label">Private list</span>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </section>
            </div>
          </section>
          {wishList.length > 0 ? (
            <section className="px-8">
              <div className="max-w-[1400px] m-auto py-3 pb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Image
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        More Options
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wishList.map((product) => {
                      return (
                        <tr key={product?.gig?._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-20">
                                <img
                                  className="h-10 w-20 object-cover"
                                  src={`${IMAGES_URL}/${product?.gig?.images[0]}`}
                                  alt=""
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product?.gig?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product?.gig?.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                router.push(`/gig/${product.gig._id}`)
                              }
                              className="flex items-center"
                            >
                              {/* <AiFillEye className="text-[21px] text-green-400" /> */}
                              View Details
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button onClick={() => handleRemove(product?._id)}>
                              <BsTrash3 className="text-[21px] text-red-500" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <div className="py-20">
              <di className="flex flex-col items-center pt-[16px">
                <span
                  className="XQskgrQ"
                  aria-hidden="true"
                  style={{width:" 46px", height:"46px;"}}
                >
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 46 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.102 33.205c8.893 0 16.103-7.21 16.103-16.103S25.995 1 17.102 1 1 8.21 1 17.102c0 8.893 7.21 16.103 16.102 16.103zM9.5 7.23c2.738-2.256 6.256-3.246 9.562-2.562"
                      stroke="#404145"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M29.44 33.518L39.482 43.56c.586.587 1.466.587 2.052 0l1.026-1.026c.587-.586.587-1.466 0-2.052L32.518 30.44c-.586-.587-1.466-.587-2.052 0l-1.026 1.026c-.587.586-.587 1.466 0 2.052z"
                      fill="#A6EACA"
                      stroke="#404145"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M29.753 30.523l-1.687-1.687"
                      stroke="#404145"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M38.57 21.703v1.534M38.57 24.77v1.533M37.804 24.004H36.27M40.87 24.004h-1.533M42.937 28.602v1.533M42.937 31.668v1.534M42.17 30.902h-1.533M45.237 30.902h-1.533M19.402 36.273v1.534M19.402 39.34v1.533M18.635 38.574h-1.533M21.702 38.574h-1.534"
                      stroke="#C5C6C9"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                    ></path>
                  </svg>
                </span>
                <h3 className="">Keep everything you like right here!</h3>
                <p>Here are some ideas to get started</p>
              </di>
            </div>
          )}
          <section className="py-20">
            <PopularGigCarousel />
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default wishList;
