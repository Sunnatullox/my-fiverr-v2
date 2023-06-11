import React, { useEffect, useState } from "react";
import FiverrLogo from "./FiverrLogo";
import Link from "next/link";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  API_URL,
  AUTH_ROUTES,
  GET_USER_INFO,
  HOST,
  ORDERS_ROUTES,
} from "../utils/constants";
import ContextMenu from "./ContextMenu";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import HeaderMenu from "./HeaderMenu";
import { AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-toastify";
import Notifications from "./Notifications/Notifications";
import MessageNotif from "./Messages/MessageNotif";

function Navbar() {
  const [cookies] = useCookies();
  const router = useRouter();
  const [navFixed, setNavFixed] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [
    { showLoginModal, isSeller, showSignupModal, userInfo, categorys },
    dispatch,
  ] = useStateProvider();

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

  const handleSignup = () => {
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  };

  useEffect(() => {
    const positionNavbar = () => {
      window.scrollY > 50 ? setNavFixed(true) : setNavFixed(false);
    };

    if (router.pathname === "/") {
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setNavFixed(true);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (categorys.length === 0) getCategorys();
  }, [router.pathname, categorys]);

  const getCategorys = async () => {
    try {
      const fullCategorys = await axios.get(`${API_URL}/get-categorys`);
      dispatch({
        type: reducerCases.GET_CATEGORYS,
        payload: fullCategorys.data,
      });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    router.push("/buyer/orders");
  };

  const handleModeSwitch = async () => {
    try {
      const { data } = await axios.put(
        `${AUTH_ROUTES}/set-user-role`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      dispatch({ type: reducerCases.SWITCH_MODE, payload: data.role });
      getUserInfo();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (cookies.jwt && !userInfo) {
      getUserInfo();
    } else {
      setIsLoaded(true);
    }
    if (userInfo && cookies.jwt) {
      getUserMessegeNotifications();
    }
  }, [cookies.jwt, userInfo]);

  const getUserInfo = async () => {
    try {
      const {
        data: { user },
      } = await axios.post(
        GET_USER_INFO,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );

      dispatch({
        type: reducerCases.SWITCH_MODE,
        payload: user?.role == "SELLER" ? true : false,
      });
      let projectedUserInfo = { ...user };
      if (user.image) {
        if (user.OAuth) {
          projectedUserInfo = {
            ...projectedUserInfo,
            imageName: user.image,
          };
        } else {
          projectedUserInfo = {
            ...projectedUserInfo,
            imageName: HOST + "/" + user.image,
          };
        }
      }
      delete projectedUserInfo.image;
      dispatch({
        type: reducerCases.SET_USER,
        userInfo: projectedUserInfo,
      });

      setIsLoaded(true);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (userInfo?.isProfileInfoSet === false) {
      router.push("/profile");
    }
    if (isSeller && userInfo) {
      sillerOrderNotification();
    } else {
      dispatch({ type: reducerCases.GET_SELLER_ORDERSNOTIF, payload: [] });
    }
  }, [userInfo, isSeller]);

  const sillerOrderNotification = async () => {
    try {
      const { data } = await axios.get(
        `${ORDERS_ROUTES}/get-seller-order-notif`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      dispatch({ type: reducerCases.GET_SELLER_ORDERSNOTIF, payload: data });
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    const clickListener = (e) => {
      e.stopPropagation();

      if (isContextMenuVisible) setIsContextMenuVisible(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", clickListener);
    }
    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [isContextMenuVisible]);

  const ContextMenuData = [
    {
      name: "Profile",
      callback: (e) => {
        e.stopPropagation();

        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: isSeller ? "To be a Buyer" : "To be a Seller",
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        handleModeSwitch();
      },
    },
    {
      name: "Logout",
      callback: (e) => {
        e.stopPropagation();

        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

  const links = [
    {
      linkName: "Fiverr Business",
      handler: "https://www.fiv(error.com/business?source=header_pop_up",
      type: "link",
    },
    { linkName: "Explore", handler: "#", type: "link" },
    { linkName: "English", handler: "#", type: "link" },
    {
      linkName: "Become a Seller",
      handler: "https://www.fiv(error.com/start_selling?source=top_nav",
      type: "link",
    },
    { linkName: "Sign in", handler: handleLogin, type: "button" },
    { linkName: "Join", handler: handleSignup, type: "button2" },
  ];

  const getUserMessegeNotifications = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/messages/user-message-notif`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      dispatch({ type: reducerCases.GET_USER_MESSAGE_NOTIF, payload: data });
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      {isLoaded && (
        <div>
          <div
            className={`w-full gap-10 px-10 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
              navFixed || userInfo
                ? "fixed bg-white border-b border-gray-200"
                : "absolute bg-transparent border-transparent"
            }`}
          >
            <div>
              <Link href="/">
                <FiverrLogo
                  fillColor={!navFixed && !userInfo ? "#ffffff" : "#404145"}
                />
              </Link>
            </div>
            <div
              className={`flex relative w-full ${
                navFixed || userInfo ? "opacity-1" : "opacity-0"
              }`}
            >
              <input
                type="search"
                id="search-dropdown"
                className=" w-full max-w-[30rem] block py-2.5 px-4 p-2.5 z-20 text-sm bg-gray-50 rounded-r-lg border-l-gray-100 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="What service are you looking for today?"
                required
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  searchData !== "" &&
                  searchData !== " " &&
                  router.push(`/search?q=${searchData}`)
                }
                className="top-0 right-0 p-2.5 text-sm font-medium text-white bg-gray-900 rounded-r-lg border"
              >
                <IoSearchOutline className="fill-white text-white h-5 w-6" />
              </button>
            </div>
            <nav>
              {!userInfo ? (
                <ul className="flex list-none list-image-none min-w-max">
                  {links.map(({ linkName, handler, type }) => {
                    return (
                      <li
                        key={linkName}
                        className={`${
                          navFixed ? "text-gray" : "text-white"
                        } font-medium pr-6`}
                      >
                        {type === "link" && (
                          <Link href={handler}>{linkName}</Link>
                        )}
                        {type === "button" && (
                          <button onClick={handler}>{linkName}</button>
                        )}
                        {type === "button2" && (
                          <button
                            onClick={handler}
                            className={`border text-md font-semibold py-1 px-3 rounded-sm ${
                              navFixed
                                ? "border-[#1DBF73] text-[#1DBF73]"
                                : "border-white text-white"
                            } hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500`}
                          >
                            {linkName}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="flex gap-8 items-center min-w-max">
                  <li className="cursor-pointer text-[#3631c9] font-medium">
                    <a href="https://www.fiv(error.com/business?source=header_pop_up">
                      Fiverr Business
                    </a>
                  </li>
                  {isSeller ? (
                    <>
                      <li
                        className="cursor-pointer text-[#1DBF73] font-medium"
                        onClick={() => router.push("/seller/gigs/create")}
                      >
                        Create Gig
                      </li>
                      <Notifications />
                      <MessageNotif />
                      <li
                        className="cursor-pointer font-medium"
                        onClick={() => router.push("/seller")}
                      >
                        Switch To Seller
                      </li>
                    </>
                  ) : (
                    <>
                      <MessageNotif />
                      <li className="cursor-pointer text-[#646464] font-medium">
                        <AiOutlineHeart
                          onClick={() => router.push("/wishList")}
                          className="text-[23px]"
                        />
                      </li>
                      <li
                        className="cursor-pointer text-[#646464] font-medium"
                        onClick={handleOrdersNavigate}
                      >
                        Orders
                      </li>
                    </>
                  )}
                  <li
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContextMenuVisible(true);
                    }}
                    title="Profile"
                  >
                    {userInfo?.imageName ? (
                      <Image
                        src={userInfo.imageName}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative">
                        <span className="text-xl text-white">
                          {userInfo &&
                            userInfo?.email &&
                            userInfo?.email.split("")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </li>
                </ul>
              )}
            </nav>
            {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
          </div>

          <HeaderMenu show={navFixed} categorys={categorys} />
        </div>
      )}
    </>
  );
}

export default Navbar;
