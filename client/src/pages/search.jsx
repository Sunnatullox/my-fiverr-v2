import SearchGridItem from "../components/Search/SearchGridItem";
import { SEARCH_GIGS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ratings } from "../utils/categories";
import { ToastContainer, toast } from "react-toastify";
import AuthWrapper from "../components/AuthWrapper";
import { useStateProvider } from "../context/StateContext";
import Spiner from "../components/spiner/Spiner";
import Pagination from "../components/Gigs/Pagination";

function Search() {
  const router = useRouter();
  const { category, q, subCategory, page } = router.query;
  const [{ showSignupModal, showLoginModal }, dispatch] = useStateProvider();
  const [gigs, setGigs] = useState(null);
  const [searchHeader, setSearchHeader] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [categ, setCateg] = useState(null);
  const [subCategs, setSubCategs] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalGigs, setTotalGigs] = useState(Number);
  const [totalPages, setotalPages] = useState(Number);

  const currentPage = parseInt(page) || 1;

  useEffect(() => {
    const getData = async () => {
      try {
        if (!subCategory && !minPrice && !maxPrice && !rating) {
          setLoading(true);
        }
        const {
          data: {
            gigs,
            category: categorys,
            subCategory: subCateg,
            totalGigs,
            totalPages,
          },
        } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?${q ? `searchTerm=${q}` : ""}${
            category ? `&category=${category}` : ""
          }${subCategory ? `&subCategory=${subCategory}` : ""}${
            minPrice > 0 ? `&minPrice=${minPrice}` : ""
          }${
            maxPrice > 0 ? `&maxPrice=${maxPrice}` : ""
          }${rating !== null ? `&rating=${rating}` : ""}${
            page ? `&page=${page}` : ""
          }`
        );
        setGigs(gigs);
        setCateg(categorys);
        setSubCategs(subCateg);
        setTotalGigs(totalGigs);
        setotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response) {
          toast.error(error.response.data.message);
        }
      }
    };
    if (category || q || subCategory || minPrice || maxPrice || rating || page) {
      getData();
      setSearchHeader(category || q || subCategory);
    }
  }, [category, q, subCategory, minPrice, maxPrice, rating, page]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const ratingAccordion = () => {
    setRatingOpen(!ratingOpen);
  };

  return loading ? (
    <Spiner />
  ) : (
    <>
      <div className="grid grid-cols-4 gap-2 ">
        <aside
          id="logo-sidebar"
          className="col-span-1/4 w-[19rem] left-0 h-full transition-transform  bg-white border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidebar"
        >
          <h2 className="text-lg font-medium text-center text-gray-500 mb-2">
            Filter
          </h2>
          <div className="w-ful p-4">
            {(categ || subCategs) && (
              <div className="py-4">
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={toggleAccordion}
                >
                  {subCategory ? (
                    <span>{subCategs?.title}</span>
                  ) : (
                    <span>{categ?.title}</span>
                  )}
                  <svg
                    className={`w-6 h-6 rotate-${
                      isOpen ? "0" : "180"
                    } shrink-0`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {isOpen && (
                  <div className="p-3 border border-b-0 border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <dl className="max-w-md text-gray-900 divide-y divide-gray-300 dark:text-white dark:divide-gray-900">
                      {(categ || subCategs)?.subCategorys?.map((item) => {
                        if (
                          subCategs?.itemSubCateg &&
                          subCategs?.itemSubCateg?._id === item?._id
                        ) {
                          return (
                            <div
                              key={item?._id}
                              className="py-2 flex items-center space-x-3"
                            >
                              <input
                                id={`link-radio-${item?._id}`}
                                type="radio"
                                value={item.slug}
                                checked
                                onChange={(e) =>
                                  router.push(
                                    `/search?subCategory=${e.target.value}`
                                  )
                                }
                                name="default-radio"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor={`link-radio-${item?._id}`}
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                {item?.title}
                              </label>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={item?._id}
                              className="py-2 flex items-center space-x-3"
                            >
                              <input
                                id={`link-radio-${item?._id}`}
                                type="radio"
                                value={item.slug}
                                onChange={(e) =>
                                  router.push(
                                    `/search?subCategory=${e.target.value}`
                                  )
                                }
                                name="default-radio"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor={`link-radio-${item?._id}`}
                                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                {item?.title}
                              </label>
                            </div>
                          );
                        }
                      })}
                    </dl>
                  </div>
                )}
              </div>
            )}
            <div className="grid mb-4">
              <span className=" text-xl my-2">Price</span>
              <div className="flex gap-4 my-2">
                <div>
                  <label htmlFor="minPrice" className="block font-medium mb-2">
                    From
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    defaultValue={0}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min={0}
                    max={10000}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                    placeholder="Enter minimum price"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block font-medium mb-2">
                    To
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    defaultValue={0}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min={minPrice}
                    max={minPrice * 2}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                    placeholder="Enter maximum price"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <input
                    id="small-range"
                    type="range"
                    defaultValue={0}
                    value={minPrice}
                    min={0}
                    max={1000}
                    onChange={(e) => setMinPrice(e.target.value)}
                    step={1}
                    className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                  />
                </div>
                <div>
                  <input
                    id="small-range"
                    type="range"
                    defaultValue={0}
                    value={maxPrice}
                    min={minPrice}
                    max={1000 * 2}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    step={1}
                    className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div>
                <button
                  type="button"
                  className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={ratingAccordion}
                >
                  <span>Search by Rating</span>
                  <svg
                    className={`w-6 h-6 rotate-${
                      ratingOpen ? "0" : "180"
                    } shrink-0`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                {ratingOpen && (
                  <div className="p-3 border border-b-0 border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                    <dl className="max-w-md text-gray-900 divide-y divide-gray-300 dark:text-white dark:divide-gray-900">
                      <div className="py-2 flex items-center space-x-3">
                        <input
                          id={`link-radio1`}
                          type="radio"
                          value={""}
                          onChange={(e) => setRating(e.target.value)}
                          name="default-radio"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={`link-radio1`}
                          className="flex items-center"
                        >
                          All
                        </label>
                      </div>
                      {ratings.map((item) => (
                        <div
                          key={item?.id}
                          className="py-2 flex items-center space-x-3"
                        >
                          <input
                            id={`link-radio-${item?.id}`}
                            type="radio"
                            value={item.id}
                            onChange={(e) => setRating(e.target.value)}
                            name="default-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`link-radio-${item?.id}`}
                            className="flex items-center"
                            dangerouslySetInnerHTML={{ __html: item?.rating }}
                          ></label>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="col-span-3">
          {gigs && (
            <div className="mx-2">
              <div className="flex py-2">
                {searchHeader && (
                  <h3 className="text-xl">
                    Results for <strong>{searchHeader}</strong>
                  </h3>
                )}
                <div className="ml-auto">
                  <span className="text-[#74767e] font-medium ">
                    {gigs.length} services available
                  </span>
                </div>
              </div>
              <hr className="py-2" />
              <div>
                <div className="grid grid-rows-2 grid-cols-3 gap-[3rem] overflow-y-auto">
                  {gigs.map((gig) => (
                    <SearchGridItem gig={gig} key={gig._id} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {totalPages > 1 && (
          <div className=" text-center py-4">
            <Pagination
              category={category}
              q={q}
              subCategory={subCategory}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
          )}
        </div>
      </div>
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </>
  );
}

export default Search;

// divide-y divide-slate-200
