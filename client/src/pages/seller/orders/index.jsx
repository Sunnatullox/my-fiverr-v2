import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  const [cookies] = useCookies();

  
  useEffect(() => {
    const getOrders = async () => {
      try {
        const {
          data: { orders },
        } = await axios.get(GET_SELLER_ORDERS_ROUTE, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        });
        setOrders(orders);
      } catch (error) {
        if(error.response){
        toast.error(error.response.data.message)
      }
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);
  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
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
                Ordered By
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Send Message
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={order._id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    <Link className=" text-blue-500" href={`/seller/orders/${order._id}`} >
                    {order._id}
                    </Link>
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {order.gig[0].title}
                  </th>
                  <td className="px-6 py-4">{order.gig[0].category}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.gig[0].deliveryTime}</td>
                  <td className="px-6 py-4">
                    {order.buyer[0].fullname} ({order.buyer[0].username})
                  </td>
                  <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>

                  <td className="px-6 py-4 ">
                    <Link
                      href={`/seller/orders/messages/${order._id}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Send
                    </Link>
                  </td>
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
