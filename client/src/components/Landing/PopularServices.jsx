import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { HOST } from "../../utils/constants";

function PopularServices({popularCateg}) {
  const router = useRouter();
  return (
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        Popular Services
      </h2>
      <ul className="flex flex-wrap gap-16">
        {popularCateg.map((item) => {
          return (
            <li
              key={item?._id}
              className="relative cursor-pointer"
              onClick={() => router.push(`/search?subCategory=${item?.slug}`)}
            >
              <div className="absolute z-10 text-white left-5 top-4">
                <span>{item?.description}</span>
                <h6 className="font-extrabold text-2xl">{item?.title}</h6>
              </div>
              <div className="h-80 w-72 ">
                <Image src={`${HOST}/${item?.logo}`} fill alt="service" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PopularServices;
