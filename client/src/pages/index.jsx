import axios from "axios";
import AuthWrapper from "../components/AuthWrapper";
import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import FiverrBusiness from "../components/Landing/FiverrBusiness";
import HeroBanner from "../components/Landing/HeroBanner";
import JoinFiverr from "../components/Landing/JoinFiverr";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import { useStateProvider } from "../context/StateContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../utils/constants";
import Spiner from "../components/spiner/Spiner";


function Index() {
  const [{ showLoginModal, showSignupModal,popularCategs, categorys },dispatch] = useStateProvider();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPopularCategorys()
    setLoading(true)
  }, []);
  const getPopularCategorys = async() => {
    try {
      const {data} = await axios.get(`${API_URL}/get-pupular-sub-categorys`)
        dispatch({type:"GET_POPULAR_CATEGORYS", payload:data});
        setLoading(false)
    } catch (error) {
      setLoading(false)
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  }
  return loading ? (
    <Spiner/>
  ): (
    <div>
      <HeroBanner popularCateg={popularCategs} />
      <Companies />
      <PopularServices popularCateg={popularCategs}/>
      <Everything />
      <Services categorys={categorys}/>
      <FiverrBusiness />
      <JoinFiverr />
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </div>
  );
}

export default Index;
