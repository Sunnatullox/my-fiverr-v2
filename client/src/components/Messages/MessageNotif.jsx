import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { useStateProvider } from "../../context/StateContext";
import Link from 'next/link'
import { HOST } from "../../utils/constants";
import moment from "moment";
import { BsBellSlash } from "react-icons/bs";

export default function MessageNotif() {
  const container = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [{ userMessage,isSeller }, dispatch] = useStateProvider();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id !== "messageNotification") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  
  return (
    <div>
      <button
        id="messageNotification"
        data-dropdown-toggle
        className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
        type="button"
        ref={container}
      >
        <li id="messageNotification" className="mt-1 cursor-pointer text-[#646464]  font-medium relative inline-block">
          <AiOutlineMail id="messageNotification" className="text-[23px]" />
        
          {userMessage.length > 0 && (
          <span
            id="messageNotification"
            className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-1 text-[9px] font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
          >
           {userMessage.length}
          </span>
          )}
        </li>
      </button>

      {isOpen && (
        <div
          id="modalContainer"
          className="grid  fixed z-[20] left-0 w-screen h-screen justify-center items-center "
        >
          <div
            id="messageNotification"
            className={`md:place-self-end md:mr-[17.5rem] md:top-0 place-self-center ${
              isOpen ? "block" : "hidden"
            } absolute z-[21] w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700`}
            aria-labelledby="messageNotificationButton"
          >
            <div
              id="messageNotification"
              className="flex items-center gap-1 px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
            >
              <AiOutlineMail id="dropdownNotification" className="text-base" />
              <p>Inbox ({userMessage.length})</p>
            </div>
            <div className="divide-y  h-[24rem] overflow-y-auto divide-gray-100 dark:divide-gray-700">
              {userMessage?.map(item => (
              <Link
              href={isSeller ? `/seller/orders/messages/${item.order?._id}` : `/buyer/orders/messages/${item.order?._id}`}
              key={item._id}
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                {item.sender.profileImage ? (
                  <img
                    className="rounded-full w-11 h-11"
                    src={`${HOST}/${item.sender.profileImage}`}
                    alt={`${item.sender.username}`}
                  />
                ) : (
                  <div className="bg-purple-500 h-11 w-11 flex items-center justify-center rounded-full relative">
                    <span className="text-lg text-white">
                      {item?.sender?.email[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full pl-3">
                <div className="grid text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                  <span className="flex font-semibold text-gray-900 dark:text-white">
                    {item.sender.username} {item.sender.fullname}
                  </span>{" "}
                  {Array.from(item.text).length >= 73 ? (
                    <>{item.text?.slice(0, 73)}...</>
                  ) : (
                    <>{item?.text}.</>
                  )}
                </div>
                <div className="flex">
                  <span className="text-xs text-blue-600 dark:text-blue-500">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </Link>
        
              ))}
               {userMessage.length === 0 && (
                <div className=" items-center bg-white flex flex-col h-full justify-center leading-5 text-center">
                    <strong className=" contents text-[17px] font-normal pb-[10px]" >
                      <span style={{margin:"0 auto 10px"}} className="h-[55px] w-[55px] grid justify-center rounded-full bg-zinc-100">
                      <BsBellSlash
                        id="dropdownNotification"
                        className="text-2xl self-center"
                      />
                      </span>
                      No Notifications
                    </strong>
                    <p className="text-[#b5b6ba] text-[14px] max-w-[240px]">​Browse our amazing catalog of Gigs or offer your talent on Fiverr.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
