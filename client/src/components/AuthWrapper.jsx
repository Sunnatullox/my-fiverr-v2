import { useCookies } from "react-cookie";
import { API_URL, LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { AiOutlineClose } from "react-icons/ai";
import * as yup from "yup";
import { useFormik } from "formik";
import { auth, provider, faceBookProvider } from "../utils/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const authSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();
  const [{ showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (cookies.jwt) {
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      router.push("/dashboard");
    }
  }, [cookies, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authSchema,
    onSubmit: (values) => {
      handleClick(values);
    },
  });

  const handleClick = async (values) => {
    try {
      const { email, password } = values;
      if (email && password) {
        const {
          data: { user, jwt },
        } = await axios.post(
          type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        setCookies("jwt", { jwt: jwt });
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });

        if (user) {
          dispatch({ type: reducerCases.SET_USER, userInfo: user });
          window.location.reload();
        }
      }
    } catch (err) {
      if (err.response) setErrorMessage(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");
    const authModal = document.querySelector("#auth-modal");
    const blurDiv = document.querySelector("#blur-div");
    html.style.overflowY = "hidden";
    const handleBlurDivClick = () => {
      // dispatch(closeAuthModal());
    };
    const handleAuthModalClick = (e) => {
      // e.stopPropagation();
    };
    authModal?.addEventListener("click", handleAuthModalClick);
    blurDiv?.addEventListener("click", handleBlurDivClick);

    return () => {
      const html = document.querySelector("html");
      html.style.overflowY = "initial";
      blurDiv?.removeEventListener("click", handleBlurDivClick);
      authModal?.removeEventListener("click", handleAuthModalClick);
    };
  }, [showLoginModal, showSignupModal]);

  const closeAuthModal = () => {
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: false,
    });

    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: false,
    });
  };

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      if (res) {
        const {
          data: { user, jwt },
        } = await axios.post(`${API_URL}/auth/signin-google-auth`, {
          user: res._tokenResponse,
        });
        console.log(jwt, user)
        setCookies("jwt", { jwt: jwt });
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
        if (user) {
          dispatch({ type: reducerCases.SET_USER, userInfo: user });
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signInWithFaceBook = async () => {
    try {
      const res = await signInWithPopup(auth, faceBookProvider);
      if (res) {
        const {
          data: { user, jwt },
        } = await axios.post(`${API_URL}/auth/signin-google-auth`, {
          user: res._tokenResponse,
        });
        console.log(jwt, user)
        setCookies("jwt", { jwt: jwt });
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
        if (user) {
          dispatch({ type: reducerCases.SET_USER, userInfo: user });
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        id="blur-div"
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] h-max w-max bg-white flex flex-col justify-center items-center"
          id="auth-modal"
        >
          <AiOutlineClose
            onClick={closeAuthModal}
            className="cursor-pointer self-end text-[23px] mr-2 mt-1"
          />
          <div className="flex flex-col justify-center items-center p-2 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Login" : "Sign"}
              in to Fiverr
            </h3>
            <div className="flex flex-col gap-5">
              <button onClick={signInWithFaceBook} className="text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <MdFacebook className="absolute left-4 text-2xl" />
                Continue with Facebook
              </button>
              <button
                onClick={signInWithGoogle}
                className="border border-slate-300 p-3 font-medium w-80 flex items-center justify-center relative"
              >
                <FcGoogle className="absolute left-4 text-2xl" />
                Continue with Google
              </button>
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-center items-center p-8 gap-7"
          >
            <div className="relative  w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div>
            {errorMessage && (
              <div className="w-80">
                <span className="text-orange-600 text-sm">{errorMessage}</span>
              </div>
            )}
            <div className="flex flex-col gap-5">
              <div className="grid">
                <input
                  type="text"
                  name="email"
                  placeholder="Email "
                  className="border border-slate-300 p-3 w-80"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <span className="text-xs text-red-500">
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
              <div className="grid">
                <input
                  type="password"
                  placeholder="Password"
                  className="border border-slate-300 p-3 w-80"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <span className="text-xs text-red-500">
                  {formik.touched.password && formik.errors.password}
                </span>
              </div>
              <button
                className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
                type="submit"
              >
                Continue
              </button>
            </div>
          </form>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm  text-slate-700">
              {" "}
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: true,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: false,
                      });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: false,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: true,
                      });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
