import { useState } from "react";
import Breadcrumbs from "../components/BreadCrumbs";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import IssueModal from "../components/IssueModal";

export default function OngoingIssuesList() {
  useEffect(() => {
    initFlowbite();
  }, []);

  const [search, setSearch] = useState("");
  const handleSearchSubmit = () => {};
  const handleNextPage = () => {};
  const handlePrevPage = () => {};

  const ongoingIssues = [
    {
      id: 1,
      description: "Error in the login page",
      affectedService: "Authentication Service",
      cause: "Incorrect validation logic in the back-end",
      impact: "Users are unable to log in, causing disruptions for all users.",
    },
    {
      id: 2,
      description: "Payment gateway timeout",
      affectedService: "Payment Service",
      cause: "External API latency",
      impact: "Users cannot complete purchases, leading to revenue loss.",
    },
    {
      id: 3,
      description: "Slow loading of product pages",
      affectedService: "Product Service",
      cause: "Database query optimization required",
      impact: "Poor user experience on high-demand pages.",
    },
    {
      id: 4,
      description: "Emails not being sent",
      affectedService: "Email Notification Service",
      cause: "SMTP server misconfiguration",
      impact: "Users are not receiving order confirmations and updates.",
    },
    {
      id: 5,
      description: "High CPU usage on the server",
      affectedService: "Web Server",
      cause: "Unoptimized loops in a recent update",
      impact: "Degraded performance across the platform.",
    },
    {
      id: 6,
      description: "Incorrect data displayed in the dashboard",
      affectedService: "Analytics Service",
      cause: "Bug in data aggregation logic",
      impact: "Misleading insights for decision-makers.",
    },
    {
      id: 7,
      description: "Mobile app crashing on Android devices",
      affectedService: "Mobile App",
      cause: "Compatibility issue with the latest OS update",
      impact: "Significant loss of usability for Android users.",
    },
    {
      id: 8,
      description: "Unable to upload files",
      affectedService: "File Upload Service",
      cause: "Misconfigured file size limit",
      impact: "Users cannot share essential documents.",
    },
    {
      id: 9,
      description: "Search functionality returning outdated results",
      affectedService: "Search Service",
      cause: "Indexing service not running",
      impact: "Users struggle to find relevant products or information.",
    },
    {
      id: 10,
      description: "Session timeout issue",
      affectedService: "Session Management Service",
      cause: "Timeout settings set too low",
      impact: "Users are logged out prematurely, disrupting workflows.",
    },
  ];

  const [activeIssue, setActiveIssue] = useState(ongoingIssues[0]);

  return (
    <>
      <Breadcrumbs />
      <h1 className="text-xl font-semibold text-gray-900 mt-5 sm:text-2xl dark:text-white">
        Ongoing Issues
      </h1>

      <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
        <div className="max-w-screen-xl">
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
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <Link to="/ongoing/create">
                  <button
                    type="button"
                    className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  >
                    <svg
                      className="h-3.5 w-3.5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      />
                    </svg>
                    Add Issue
                  </button>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Affected Service
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Cause
                    </th>
                    <th scope="col" className="px-4 py-3">
                      IMpact
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ongoingIssues.map((issue) => (
                    <tr
                      key={issue?.id}
                      className="border-b dark:border-gray-700 "
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:cursor-pointer"
                        data-modal-target="readProductModal"
                        data-modal-toggle="readProductModal"
                        onClick={() => setActiveIssue(issue)}
                      >
                        {issue?.description}
                      </th>
                      <td className="px-4 py-3">{issue?.affectedService}</td>
                      <td className="px-4 py-3">{issue?.cause}</td>
                      <td className="px-4 py-3">{issue?.impact}</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button
                          id={`apple-imac-${issue?.id}-dropdown-button`}
                          data-dropdown-toggle={`apple-imac-${issue?.id}-dropdown`}
                          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <div
                          id={`apple-imac-${issue?.id}-dropdown`}
                          className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby={`apple-imac-${issue?.id}-dropdown-button`}
                          >
                            <li>
                              <div
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                id="readProductButton"
                                data-modal-target="readProductModal"
                                data-modal-toggle="readProductModal"
                                onClick={() => setActiveIssue(issue)}
                              >
                                Show
                              </div>
                            </li>
                            <li>
                              <Link to={`/ongoing/${issue?.id}/edit`}>
                                <div className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  Edit
                                </div>
                              </Link>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Mark as resolved
                              </a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a
                              href="#"
                              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
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
                  1 - 10
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white">
                  100
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
        {/* Modals */}
        <IssueModal issue={activeIssue} />
      </section>
    </>
  );
}
