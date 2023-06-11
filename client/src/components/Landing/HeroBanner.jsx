import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";

function HomeBanner({ popularCateg }) {
  const router = useRouter();
  const [image, setImage] = useState(1);
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    const interval = setInterval(
      () => setImage(image >= 6 ? 1 : image + 1),
      10000
    );
    return () => clearInterval(interval);
  }, [image]);

  return (
    <div className="h-[680px] relative bg-cover">
      <div className="absolute top-0 right-0 w-[110vw] h-full transition-opacity z-0">
        <div className="w-full z-1 h-full bg-black bg-opacity-20 absolute"></div>
        <video
          src="https://sg.fiverrcdn.com/packages_lp/cover_video.mp4"
          poster="//assetsv2.fiverrcdn.com/assets/v2_photos/packages-lp/bg-first-hero-d92a52e389008a9c36e1cb59634ae244.jpg"
          loop
          muted
          preload="auto"
          {...{autoPlay: true}}
          className="z-0 min-h-[580px] h-full object-cover w-full aspect-video "
          style={{ opacity: 1 }}
        >
          <source
            src="https://sg.fiverrcdn.com/packages_lp/cover_video.mp4"
            type="video/mp4"
          />
          <source
            src="https://sg.fiverrcdn.com/packages_lp/cover_video.webm"
            type="video/webm"
          />
          <source
            src="https://sg.fiverrcdn.com/packages_lp/cover_video.ogv"
            type="video/ogv"
          />
        </video>
      </div>
      <div className="z-10 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-20">
        <h1 className="text-white text-5xl leading-snug">
          Find the perfect&nbsp;
          <i>freelance</i>
          <br />
          services for your business
        </h1>
        <div className="flex align-middle">
          <div className="relative">
            <IoSearchOutline className="absolute text-gray-500 text-2xl flex align-middle h-full left-2" />
            <input
              type="text"
              className="h-14 w-[450px] pl-10 rounded-md rounded-r-none"
              placeholder={`Try "building mobile app"`}
              value={searchData}
              required
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <button
            className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md"
            onClick={() =>
              searchData !== "" &&
              searchData !== " " &&
              router.push(`/search?q=${searchData}`)
            }
          >
            Search
          </button>
        </div>
        <div className="text-white flex gap-4">
          Popular:
          <ul className="flex gap-5">
            {popularCateg?.slice(0, 4).map((item) => (
              <li key={item?._id}>
                <Link
                  className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                  href={`/search?subCategory=${item?.slug}`}
                >
                  {item?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
