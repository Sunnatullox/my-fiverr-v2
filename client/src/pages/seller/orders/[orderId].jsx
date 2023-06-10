import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL, IMAGES_URL } from "../../../utils/constants";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import moment from "moment";
import { GoFileZip } from "react-icons/go";
import {
  AiOutlineCheckCircle,
  GoFileZAiOutlineCheckCircleip,
} from "react-icons/ai";
import { BiRevision, BiTimeFive } from "react-icons/bi";
import { toast } from "react-toastify";
import Spiner from "../../../components/spiner/Spiner";
import { storage } from "../../../utils/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import Link from "next/link";

export default function Order() {
  const router = useRouter();
  const [cookies] = useCookies();
  const { orderId } = router.query;
  const [orderDetails, setOrderDetails] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (orderId) {
      if (!uploadedFile) {
        setLoading(true);
      }
      getOrderDetails();
    }
  }, [orderId, router.pathname]);

  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/orders/get-seller-order-details/${orderId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      setOrderDetails(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (uploadedFile && uploadFile) handleUploadFileServer();
  }, [uploadedFile]);

  const handleUploadFileServer = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/orders/set-order-file-upload/${orderId}`,
        { file: uploadedFile, fileTitle: uploadFile.name },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      setUploadFile(null);
      setUploadedFile(null);
      getOrderDetails();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleUploadFile = async () => {
    if (uploadFile === null) return;
    setUploadLoading(true);
    const fileRef = ref(storage, `files/${Date.now() + "-" + uploadFile.name}`);
    const uploadTack = uploadBytesResumable(fileRef, uploadFile);

    uploadTack.on(
      "state_changed",
      (snapShot) => {
        const prog = Math.round(
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTack.snapshot.ref).then((url) => {
          setUploadedFile(url);
        });
      }
    );
  };

  return loading ? (
    <Spiner />
  ) : (
    <div>
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        <div className="flex justify-start item-start space-y-2 flex-col">
          <div className="flex items-center">
            <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
              Order #{orderDetails?._id}
            </h1>
            <span className="ml-auto flex items-center gap-1">
              <AiOutlineCheckCircle className=" fill-green-400 text-[24px]"/> Payemnted successfully
            </span>
          </div>
          <hr />
          <div className="grid gap-2">
            <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
              {orderDetails?.createdAt && (
                <>
                  ordered Time:{" "}
                  {moment(orderDetails?.createdAt).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </>
              )}
            </p>
            <p>
              Buyer: {orderDetails.buyer?.username}{" "}
              {orderDetails.buyer?.fullname}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
              <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                Gig Details
              </p>
              <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                <div className="pb-4 md:pb-8 w-full md:w-40">
                  <img
                    className="w-full hidden md:block"
                    src={`${IMAGES_URL}/${orderDetails.gig?.images[0]}`}
                    alt="dress"
                  />
                  <img
                    className="w-full md:hidden"
                    src={`${IMAGES_URL}/${orderDetails.gig?.images[0]}`}
                    alt="dress"
                  />
                </div>
                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                    <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                      {orderDetails.gig?.title}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="px-8">
                <div className="flex">
                  <span className="px-2">Description:</span>
                  {orderDetails.gig?.description && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: orderDetails.gig?.description,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                  Summary
                </h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Price:
                    </p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      ${orderDetails?.price}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Delivery Time:
                    </p>
                    <p className="flex text-base dark:text-gray-300 leading-4 text-gray-600">
                      <BiTimeFive /> {orderDetails.gig?.deliveryTime} days
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Revisions:
                    </p>
                    <p className="flex text-base dark:text-gray-300 leading-4 text-gray-600">
                      <BiRevision /> {orderDetails.gig?.revisions}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                    Order was made :
                  </p>
                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                    {orderDetails?.createdAt && (
                      <>{moment(orderDetails?.createdAt).fromNow()}</>
                    )}
                  </p>
                </div>
                <div className="grid gap-y-2">
                  {orderDetails.orderFile?.map((item) => (
                    <div key={item._id} className="flex gap-1 items-end">
                      <Link href={item.file}>
                        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                          <svg
                            class="fill-current w-4 h-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </Link>
                      <p>{item.fileTitle}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                  Send File
                </h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-8 h-8">
                      <img
                        className="w-full h-full"
                        alt="logo"
                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center">
                      <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                        file submission procedure
                        <br />
                        <span className="font-normal">
                          Send the file in zip or rar format
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center items-center">
                  <label
                    htmlFor="ShippingOrder"
                    className="hover:bg-green text-center dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 py-5 w-96 md:w-full bg-green-400 text-base font-medium leading-4 text-white"
                  >
                    Press to enter
                  </label>
                  <input
                    id="ShippingOrder"
                    type="file"
                    accept=".rar,.zip"
                    onChange={(e) => {
                      setUploadFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </div>
                {uploadFile !== null && (
                  <>
                    <div className=" bg-stone-100 w-full h-20 flex">
                      <div className="grid py-1">
                        <div className="flex items-end gap-1 ml-2">
                          <GoFileZip className="text-3xl " />
                          <p className="text-sm">{uploadFile.name}</p>
                        </div>
                      </div>
                    </div>
                    {uploadLoading && progress !== 100 ? (
                      <button
                        onClick={handleUploadFile}
                        disabled
                        className=" gap-1 self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                      >
                        Progress
                        <span>{progress}%</span>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 mr-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={handleUploadFile}
                        className="self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                      >
                        Send
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
