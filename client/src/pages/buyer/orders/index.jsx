import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Spiner from "../../../components/spiner/Spiner";
import { useCookies } from "react-cookie";

function Orders() {
  const [orders, setOrders] = useState(null);
  const [{ userInfo }] = useStateProvider();
  const [loading, setLoading] = useState(false);
  const [isOepn, setIsOepn] = useState(false);
  const [cookies] = useCookies();
  useEffect(() => {
    if (userInfo) getOrders();
  }, [userInfo]);
  const getOrders = async () => {
    setLoading(true);
    try {
      const {
        data: { orders },
      } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.jwt.jwt}`,
        },
      });
      setOrders(orders);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const hamndleDropdown = () => {
    setIsOepn(!isOepn);
  };

  return loading ? (
    <Spiner />
  ) : (
    <div className="min-h-[80vh] my-10 mt-0 px-12">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                Revisions
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Send Message
              </th>
              <th scope="col" className="px-6 py-3">
                Order Files
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={order._id}
                >
                  <td  className="px-6 py-4 ">
                    {order.gig._id}
                  </td>
                  {Array.from(order.gig.title).length > 40 ?(
                  <td  className="px-6 py-4 font-medium">
                    {order.gig.title?.slice(0, 40)}...
                  </td>
                  ):(
                  <td  className="px-6 py-4 font-medium">
                    {order.gig.title}
                  </td>
                  )}
                  <td className="px-6 py-4">{order.gig.category}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                  <td className="px-6 py-4">{order.gig.revisions}</td>
                  <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>

                  <td className="px-6 py-4 ">
                    <Link
                      href={`/buyer/orders/messages/${order._id}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Send
                    </Link>
                  </td>
                  {order?.orderFile?.length > 0 && (
                    <td className="px-6 py-4">
                      <button
                        id="dropdownHelperButton"
                        data-dropdown-toggle="dropdownHelper"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        onClick={hamndleDropdown}
                      >
                        Download
                        <svg
                          className="w-4 h-4 ml-2"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {isOepn && (
                        <div
                          id="dropdownHelper"
                          className="z-10 absolute right-1 mt-1 border bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownHelperButton"
                          >
                            {order?.orderFile?.map((item, i) => (
                              <li key={item._id}>
                                <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                  <div className=" ml-2 text-sm">
                                    <label
                                      for="helper-checkbox-1"
                                      className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <Link href={item.file}>
                                        {i + 1}. {item.fileTitle}
                                      </Link>
                                    </label>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* <span className="flex">
                        <select id="dowload">
                          <option disabled selected className="hidden" key="1">
                            Dowload
                          </option>
                          {order?.orderFile?.map((item) => (
                            <option key={item._id}>
                              <Link href={item.file}>{item.fileTitle}</Link>
                            </option>
                          ))}
                        </select>
                      </span> */}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
