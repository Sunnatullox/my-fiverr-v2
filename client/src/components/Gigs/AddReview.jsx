import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";
import { ADD_REVIEW } from "../../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

function AddReview() {
  const [{}, dispatch] = useStateProvider();
  const [reviewData, setReviewData] = useState({ reviewText: "", rating: 0 });
  const router = useRouter();
  const { gigId } = router.query;
  const [cookies] = useCookies();
  const addReview = async () => {
    try {
      const {data} = await axios.post(
        `${ADD_REVIEW}/${gigId}`,
        { ...reviewData },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt.jwt}`,
          },
        }
      );
      if (data) {
        setReviewData({ reviewText: "", rating: 0 });
        getReview()
        dispatch({
          type: reducerCases.ADD_REVIEW,
          newReview: data.newReview,
        });
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      }
    }
  };
  const getReview = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_DATA}/${gigId}`);
        dispatch({ type: reducerCases.SET_GIG_DATA, gigData: gig });
      } catch (error) {
        if(error.response){
        toast.error(error.response.data.message)
      }
      }
    
  }
  return (
    <div className="mb-10">
      <h3 className="text-2xl my-5 font-normal   text-[#404145]">
        Give Kishan Sheth a Review
      </h3>
      <div className="flex gap-1 py-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`cursor-pointer text-xl ${
                reviewData.rating >= num ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setReviewData({ ...reviewData, rating: num })}
            />
          ))}
        </div>
      <div className="flex  flex-col  items-start justify-start gap-3">
        <textarea
          name="reviewText"
          id="reviewText"
          onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
          value={reviewData.reviewText}
          className="block p-2.5 w-4/6 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Add Review"
        ></textarea>
        <button
          className="flex items-center bg-[#1DBF73] text-white py-2 justify-center text-md relative rounded px-5"
          onClick={addReview}
        >
          Add Review
        </button>
      </div>
    </div>
  );
}

export default AddReview;
