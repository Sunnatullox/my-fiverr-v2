import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../utils/constants";
import { useCookies } from "react-cookie";
import { useStateProvider } from "../../context/StateContext";
import CarouselCard from "./CarouselCard";
import { toast } from "react-toastify";

function PopularGigCarousel() {
  const [{ wishList }, dispatch] = useStateProvider();
  const [popularGigCateg, setPopularGigCateg] = useState([]);
  const [popularGigCarousel, setPopularGigCarousel] = useState([]);
  const [cookies] = useCookies();

  useEffect(() => {
        if (wishList?.length > 0) {
          const newCategories = wishList.map((element) => element.gig.category);
    
          let updatedCategories = [...popularGigCateg];
          for (let i = 0; i < newCategories.length; i++) {
            const newCategory = newCategories[i];
            updatedCategories = updatedCategories.filter(
              (item) =>
                item !== newCategory
            );
          }
    
          setPopularGigCateg([...updatedCategories, ...newCategories]);
        } else {
          setPopularGigCateg([]);
        }
     
  }, [wishList]);

  useEffect(() => {
    if (wishList.length === 0 && popularGigCateg.length === 0) {
      popularGigs();
    } else {
      popularGigsCateg();
    }
  }, [popularGigCateg]);

  const popularGigsCateg = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/gigs/get-popular-gigs`,
        { categs: popularGigCateg },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      setPopularGigCarousel(data);
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  const popularGigs = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/gigs/get-popular-gigs`,
        { categs: [] },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      setPopularGigCarousel(data);
    } catch (error) {
       if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };

  return popularGigCarousel.length > 0 &&(
    <div className="px-9">
      <section className="grid">
        <header style={{padding:"0 0 24px"}} className=" flex items-end content-between">
        <h4 className=" text-[24px] font-bold">Most popular Gigs</h4>
        </header>
        <CarouselCard popularGigs={popularGigCarousel}/>
      </section>
    </div>
  );
}

export default PopularGigCarousel;
