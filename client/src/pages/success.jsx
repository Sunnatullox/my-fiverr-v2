import { ORDER_SUCCESS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function Success() {
  const router = useRouter();
  const { payment_intent } = router.query;
  const[cookies] = useCookies()

  useEffect(() => {
    const changeOrderStatus = async () => {
      try {
        await axios.put(
          ORDER_SUCCESS_ROUTE,
          { paymentIntent: payment_intent },
          {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
        );
      } catch (error) {
        if(error.response){
        toast.error(error.response.data.message)
      }
      }
    };
    if (payment_intent) {
      changeOrderStatus();
      setTimeout(() => router.push("/buyer/orders"), 5000);
    } else {
      router.push("/");
    }
  }, [payment_intent, router]);

  console.log(payment_intent)
  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        Payment successful. You are being redirected to the orders page.
      </h1>
      <h1 className="text-4xl text-center">Please do not close the page.</h1>
    </div>
  );
}

export default Success;
