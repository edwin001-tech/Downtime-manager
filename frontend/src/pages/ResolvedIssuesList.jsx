import Breadcrumbs from "../components/BreadCrumbs";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

export default function ResolvedIssuesList() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [showing, setShowing] = useState({});
  const [search, setSearch] = useState("");
  const currentPage = parseInt(searchParams.get("page") || 1);
  const currentUrlParams = new URLSearchParams(window.location.search);

  const getProducts = async () => {
    try {
      const url = `/api/brand/campaigns/products/?${searchParams}`;
      const { data } = await axiosInstance.get(url);
      setProducts(data?.results);
      setPerPage(data?.per_page);
      setCount(data?.count);
    } catch (error) {
      console.error("An error occured", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [searchParams]);

  // Pagination
  const handleNextPage = () => {
    const totalPages = Math.ceil(parseInt(count) / parseInt(perPage));
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;
    currentUrlParams.set("page", nextPage);
    setSearchParams(currentUrlParams);
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return;
    currentUrlParams.set("page", prevPage);
    setSearchParams(currentUrlParams);
  };

  useEffect(() => {
    const updateShowing = () => {
      const showingFrom = (currentPage - 1) * perPage + 1;
      const showingTo = showingFrom + perPage - 1;
      setShowing({ ...showing, from: showingFrom, to: showingTo });
    };
    updateShowing();
  }, [currentPage]);

  // Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    currentUrlParams.set("search_query", search);
    currentUrlParams.set("page", 1);
    setSearchParams(currentUrlParams);
  };

  return (
    <>
      <Breadcrumbs />
      <h1 className="text-xl font-semibold text-gray-900 mt-5 sm:text-2xl dark:text-white">
        Resolved Issues
      </h1>
      <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
        <div className=" max-w-screen-xl">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form
                  className="flex items-center"
                  onSubmit={handleSearchSubmit}
                >
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      required=""
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {product?.name}
                      </th>
                      <td className="px-4 py-3">
                        {product?.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {showing?.from}-{showing?.to}{" "}
                </span>
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {count}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    onClick={handlePrevPage}
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleNextPage}
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
