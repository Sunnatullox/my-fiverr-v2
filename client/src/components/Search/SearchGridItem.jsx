import { API_URL, HOST, IMAGES_URL } from "../../utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { FaStar } from "react-icons/fa";
import { AiTwotoneHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../context/StateContext";
import { toast } from "react-toastify";
import { reducerCases } from "../../context/constants";
import { useEffect } from "react";

function SearchGridItem({ gig }) {
  const [{ userInfo, showSignupModal, wishList }, dispatch] =
    useStateProvider();
  const router = useRouter();
  const [cookies] = useCookies();

  const calculateRatings = () => {
    const { reviews } = gig;
    let rating = 0;
    if (!reviews?.length) {
      return 0;
    }
    reviews?.forEach((review) => {
      rating += review.rating;
    });
    return (rating / reviews.length).toFixed(1);
  };

  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  };

  const handleWishListGig = async (id) => {
    if (!userInfo && !cookies.jwt) {
      handleLogin();
    } else {
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
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    if (userInfo && cookies.jwt) {
      getUserWishList();
    }
  }, [userInfo, cookies.jwt]);

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
      console.log(error);
    }
  };
  const findGigWishList =
    wishList.length > 0 && wishList.some((item) => item?.gig?._id === gig?._id);
  return (
    <Fragment key={gig._id}>
      <div className="max-w-[300px] shadow-xl p-2 flex flex-col gap-2 cursor-pointer mb-8">
        <div className="relative w-full m-auto h-40">
          <div className="absolute z-10 right-10 top-3  ">
            {findGigWishList ? (
              <FcLike
                onClick={() => handleWishListGig(gig._id)}
                className="absolute text-[28px] text-white"
              />
            ) : (
              <AiTwotoneHeart
                style={{ fill: "#b5b6ba" }}
                onClick={() => handleWishListGig(gig._id)}
                className="absolute text-[28px]"
              />
            )}
          </div>
          <Image
            src={`${IMAGES_URL}/${gig.images[0]}`}
            alt="gig"
            fill
            onClick={() => router.push(`/gig/${gig._id}`)}
            className="rounded-xl"
          />
        </div>
        <div onClick={() => router.push(`/gig/${gig._id}`)}>
          <div className="flex px-2 items-center gap-2">
            <div>
              {gig.createdBy.profileImage ? (
                <>
                {gig.createdBy.OAuth ? (
                  <Image
                    src={gig.createdBy.profileImage}
                    alt="profile"
                    height={30}
                    width={30}
                    className="rounded-full"
                  />
                  ): (
                  <Image
                    src={HOST + "/" + gig.createdBy.profileImage}
                    alt="profile"
                    height={30}
                    width={30}
                    className="rounded-full"
                  />

                )}
                </>
              ) : (
                <div className="bg-purple-500 h-7 w-7 flex items-center justify-center rounded-full relative">
                  <span className="text-lg text-white">
                    {gig?.createdBy[0]?.email[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-md ">
              <strong className="font-medium">{gig.createdBy.username}</strong>
            </span>
          </div>
          <div className="px-2">
            <p className="line-clamp-2 text-[#404145]">{gig.title}</p>
          </div>
          <div className="px-2 flex items-center gap-1 text-yellow-400">
            <FaStar className="text-xl" />
            <span>
              <strong className="font-medium">{calculateRatings()}</strong>
            </span>
            <span className="text-[#74767e]">({gig.reviews?.length}) </span>
          </div>
          <div className="px-2">
            <strong className="font-medium">From ${gig.price}</strong>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SearchGridItem;
