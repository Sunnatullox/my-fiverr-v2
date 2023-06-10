import React, { useEffect, useState } from "react";
import { useStateProvider } from "../context/StateContext";
import { useRouter } from "next/router";
import Slider from "react-slick";
import { settings } from "../utils/categories";

function HeaderMenu({ show }) {
  const [{ categorys }, dispatch] = useStateProvider();
  const router = useRouter();

 
  
  return (
    <>
      <div
      style={{padding:"12px 40px", borderTop:"1px solid #0003"}}
        className={`px-8 mt-1  box-border w-full m-0 outline-0 p-0 whitespace-pre flex top-20 z-[11] transition-[hidden] duration-300 ${
          show ? "fixed bg-white border-gray-200" : "hidden"
        }`}
      >
        <Slider className="w-full block" {...settings}>
          {categorys.map((category) => (
            <span
              key={category._id}
              className="peer group items-center justify-between space-x-5 bg-white px-4 relative group w-max"
            >
              <a
                onClick={() => router.push(`/search?category=${category.slug}`)}
                className="pl-0   menu-hover py-2 text-base font-medium text-gray-500"
              >
                {category?.title}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-green-500 transition-all group-hover:w-full top-8"></span>
              </a>
            </span>
          ))}
        </Slider>
      </div>
    </>
  );
}
// md:inset-0

export default HeaderMenu;

// <div className="fixed whitespace-pre inset-0 flex items-center justify-center">
//   <div
//     className="fixed inset-0 opacity-50"
//     onClick={closeModal}
//   ></div>
//   <div className="fixed  bg-white rounded-lg p-8">
//     <h2 className="text-2xl mb-4">Modal Sarlavhasi</h2>
//     <p className="text-gray-700">Modalning tarkibi...</p>
//     <button
//       className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
//       onClick={closeModal}
//     >
//       Yopish
//     </button>
//   </div>
// </div>

{
  /* <div className=" w-full h-[20rem] px-4 flex justify-between top-[7rem] z-30 transition-[hidden] duration-300 fixed bg-white border-b border-gray-200">
        <div className=" text-center">
          <p className=" text-black font-semibold">Hello World</p>
          <a className="my-2 block border-b py-1 font-semibold text-gray-500 hover:text-black md:mx-2">
            Product One
          </a>
          <a className="my-2 block border-b py-1 font-semibold text-gray-500 hover:text-black md:mx-2">
            Product One
          </a>
        </div>
        <div></div>
        <div></div>
      </div> */
}
