import React, { useEffect, useState } from "react";
import Pricing from "../../components/Gigs/Pricing";
import Details from "../../components/Gigs/Details";
import { useRouter } from "next/router";
import axios from "axios";
import {
  CHECK_USER_ORDERED_GIG_ROUTE,
  GET_GIG_DATA,
} from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";
import Spiner from "../../components/spiner/Spiner";
import { toast } from "react-toastify";

function Gig() {
  const router = useRouter();
  const { gigId } = router.query;
  const [{ gigData, userInfo }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    dispatch({ type: reducerCases.SET_GIG_DATA, gigData: undefined });
  }, [dispatch]);


  useEffect(() => {
    setLoading(true)
    if (gigId) fetchGigData();
  }, [gigId]);

  const fetchGigData = async () => {
    try {
      const {
        data: { gig },
      } = await axios.get(`${GET_GIG_DATA}/${gigId}`);
      dispatch({ type: reducerCases.SET_GIG_DATA, gigData: gig });
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if(error.response){
      toast.error(error.response.data.message)
    }
    }
  };

  useEffect(() => {
    const checkGigOrdered = async () => {
      try {
        const {
          data: { hasUserOrderedGig },
        } = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigId}`, {
          withCredentials: true,
        });
        dispatch({
          type: reducerCases.HAS_USER_ORDERED_GIG,
          hasOrdered: hasUserOrderedGig,
        });
      } catch (error) {
         if(error.response){
        toast.error(error.response.data.message)
      }
      }
    };
    if (userInfo) {
      checkGigOrdered();
    }
  }, [gigId, userInfo]);

  return  loading ? (
    <Spiner/>
  ) :(
    <div className="grid grid-cols-3 mx-32 gap-20">
      <Details />
      <Pricing />
    </div>
  );
}

export default Gig;
