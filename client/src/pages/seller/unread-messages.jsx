import { useStateProvider } from "../../context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_AS_READ_ROUTE } from "../../utils/constants";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function UnreadMessages() {
  const [{ userInfo }] = useStateProvider();
  const [messages, setMessages] = useState([]);
  const [cookies] = useCookies();
  useEffect(() => {
    const getUnreadMessages = async () => {
      try {
        const {
          data: { messages: unreadMessages },
        } = await axios.get(GET_UNREAD_MESSAGES, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        });
        setMessages(unreadMessages);
        
      } catch (error) {
         if(error.response){
        toast.error(error.response.data.message)
      }  
      }
    };
    if (userInfo) {
      getUnreadMessages();
    }
  }, [userInfo]);

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(
        `${MARK_AS_READ_ROUTE}/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      if (response.status === 200) {
        const clonedMessages = [...messages];
        const index = clonedMessages.findIndex((message) => message._id === id);
        clonedMessages.splice(index, 1);
        setMessages(clonedMessages);
      }
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Unread Messages</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Text
              </th>
              <th scope="col" className="px-6 py-3">
                Sender Name
              </th>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Mark as Read
              </th>
              <th scope="col" className="px-6 py-3">
                View Conversation
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={message.text}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {message?.text}
                  </th>
                  <th scope="row" className="px-6 py-4 ">
                    {message?.sender?.fullName}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {message.order}
                  </th>
                  <td className="px-6 py-4 ">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        markAsRead(message._id);
                      }}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Mark as Read
                    </Link>
                  </td>
                  <td className="px-6 py-4 ">
                    <Link
                      href={`/seller/orders/messages/${message.order}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      View
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

export default UnreadMessages;
