import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Pagination = ({ totalPages, currentPage, category, q, subCategory }) => {
  const router = useRouter();
  const handlePageChange = (page) => {
    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    router.push(
      `/search?${category ? `category=${category}` : ""}${q ? `q=${q}` : ""}${
        subCategory ? `subCategory=${subCategory}` : ""
      }&page=${page}`
    );
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li key={i}>
          <span
            className={`px-3 py-2 leading-tight ${
              currentPage === i
                ? "text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-white border dark:border-gray-400"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        </li>
      );
    }
    return paginationItems;
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px">
        <li>
          <span onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Previous
          </span>
        </li>
        {renderPaginationItems()}
        <li>
          <span onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
