import React, { Fragment } from "react";
import Carousel from "react-grid-carousel";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { AiTwotoneHeart } from "react-icons/ai";
import { API_URL, HOST, IMAGES_URL } from "../../utils/constants";
import Image from "next/image";
import { useStateProvider } from "../../context/StateContext";
import { useCookies } from "react-cookie";
import { FcLike } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-toastify";

function CarouselCard({ popularGigs }) {
  const [{ wishList }, dispatch] =
    useStateProvider();
  const [cookies] = useCookies();
  const handleAddWishListGig = async (id) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/wishList/user-add-wishList`,
        { gigId: id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );

      if (data?.gig) {
        toast.success("Gig WishList added successfully");
      }
      if (data?.msg) {
        toast.success("Gig WishList deleted successfully");
      }
      getUserWishList();
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  const getUserWishList = async () => {
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
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  return (
    <div>
      <Carousel
        containerStyle={{ maxWidth: "1400px", margin: "0 auto" }}
        cols={5}
        pages={2}
        rows={1}
        gap={30}
        scrollSnap={true}
        responsiveLayout={[
          {
            breakpoint: 1200,
            cols: 3,
          },
          {
            breakpoint: 990,
            cols: 2,
          },
        ]}
        mobileBreakpoint={670}
      >
        {popularGigs?.map((item, i) => {
          const calculateRatings = () => {
            const { reviews } = item;
            let rating = 0;
            if (!reviews?.length) {
              return 0;
            }
            reviews?.forEach((review) => {
              rating += review.rating;
            });
            return (rating / reviews.length).toFixed(1);
          };

          const findGigWishList = wishList.some(
            (wishItem) => wishItem?.gig?._id === item?._id
          );

          return (
            <Carousel.Item key={i}>
              <div className="border">
                <div className="h-full w-auto block bg-white box-border border-[1px solid #e4e5e7] relative">
                  <Link href={`/gig/${item._id}`}>
                    <div className="relative top-0 left-0 w-full h-full z-[1]">
                      <img
                        width="100%"
                        className="object-fill top-0 h-28 w-full"
                        src={`${IMAGES_URL}/${item?.images[0]}`}
                      />
                    </div>
                  </Link>
                  <div className="flex items-center justify-between relative text-[14px]">
                    <div
                      style={{ padding: "12px 12px 8px", lineHeight: " 120%" }}
                      className="h-[54px] w-full box-border flex items-center"
                    >
                      <div className="seller-identifiers">
                        <div className="flex px-2 items-center gap-2">
                          <div>
                            {item.createdBy.profileImage ? (
                              <Image
                                src={HOST + "/" + item.createdBy.profileImage}
                                alt="profile"
                                height={30}
                                width={30}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="bg-purple-500 h-6 w-6 flex items-center justify-center rounded-full relative">
                                <span className="text-lg text-white">
                                  {item.createdBy[0].email[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-[8px]">
                            <div className="flex justify-start">
                              <div className="h-[18px] text-[#222325] text-ellipsis overflow-hidden whitespace-nowrap">
                                <a
                                  href="#"
                                  className="text-[#222325] font-semibold"
                                >
                                  {item.createdBy.username}
                                </a>
                              </div>
                            </div>
                            <span className="text-[#74767e] font-medium leading-5">
                              <div className="inline-flex">
                                <span className="inline-flex text-yellow-400">
                                  Top Rated Seller
                                </span>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3>
                    <Link
                      href={`/gig/${item._id}`}
                      style={{ padding: "0 12px 5px" }}
                      className="block text-[16px] cursor-pointer text-[#222325] leading-[22px] font-normal h-[43px] box-border overflow-hidden mt-[5px] break-words hover:text-[#1dbf73] hover:ease-in "
                    >
                      {Array.from(item?.title)?.length > 55 ? (
                        <>{item.title?.slice(0, 55)}...</>
                      ) : (
                        <>{item.title}</>
                      )}
                    </Link>
                  </h3>
                  <div
                    className="flex justify-between h-[40px] box-border"
                    style={{ padding: "10px 12px" }}
                  >
                    <div className="px-2 flex items-center gap-1 text-yellow-400">
                      <FaStar className="text-xl" />
                      <span>
                        <strong className="font-medium">
                          {calculateRatings()}
                        </strong>
                      </span>
                      <span className="text-[#74767e]">
                        ({item?.reviews?.length})
                      </span>
                    </div>
                  </div>
                  <footer
                    style={{
                      padding: "10px 12px",
                      borderTop: "1px solid #efeff0",
                    }}
                    className=" flex justify-between min-h-[24px]  items-center clear-both border-t-gray-400"
                  >
                    <div className="flex">
                      <div className="inline-flex">
                        {findGigWishList ? (
                          <FcLike
                            onClick={() => handleAddWishListGig(item._id)}
                            className="text-xl cursor-pointer"
                          />
                        ) : (
                          <AiTwotoneHeart
                            style={{ fill: "#b5b6ba" }}
                            className="text-xl cursor-pointer"
                            onClick={() => handleAddWishListGig(item._id)}
                          />
                        )}
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-[18px] leading-5 mt-1 text-[#404145] text-right"
                    >
                      <small
                        style={{ padding: "2px 0 0" }}
                        className="text-[#74767e] text-[10px] font-bold tracking-widest uppercase inline-block align-top"
                      >
                        Starting at
                      </small>
                      <span className="pl-[6px]">US$ 15</span>
                    </a>
                  </footer>
                </div>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}

export default CarouselCard;
