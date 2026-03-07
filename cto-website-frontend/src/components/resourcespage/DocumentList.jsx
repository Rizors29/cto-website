import { useRef, useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { dateFormatLong } from "../../utils/dateFormat";
import filterTableData from "../../utils/filterTableData";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { sortByString, sortByDate } from "../../utils/sort"

import { TrashIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

import {
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFolder
} from "react-icons/fa";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import ENDPOINTS from "../../utils/endpoint";
import api from "../../utils/api";

function DocumentList({ variant = "full" }) {
  const fileInputRef = useRef(null);
  const [guidelines, setGuidelines] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const isSidebar = variant === "sidebar";
  const effectiveEntriesPerPage = isSidebar ? 5 : entriesPerPage;

  const [sortConfig, setSortConfig] = useState({
    key: null,
    type: null,
    order: null,
  });
  const [showSortMenu, setShowSortMenu] = useState(null);

  const filteredGuidelines = filterTableData(guidelines, searchTerm);

  const sortedGuidelines = (() => {
    if (!sortConfig.key) return filteredGuidelines;

    if (sortConfig.type === "string") {
      return sortByString(
        filteredGuidelines,
        sortConfig.key,
        sortConfig.order
      );
    }

    if (sortConfig.type === "date") {
      return sortByDate(
        filteredGuidelines,
        sortConfig.key,
        sortConfig.order
      );
    }

    return filteredGuidelines;
  })();

  const totalEntries = sortedGuidelines.length;
  const totalPages = Math.ceil(totalEntries / effectiveEntriesPerPage);

  const startIndex = (currentPage - 1) * effectiveEntriesPerPage;
  const endIndex = startIndex + effectiveEntriesPerPage;


  const displayedGuidelines = sortedGuidelines.slice(
    startIndex,
    endIndex
  );

  const buttonClass = "px-3 py-1 mx-1 text-sm rounded-lg transition-colors duration-150 ease-in-out";
  const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const disabledClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig, entriesPerPage]);


  const getFileExtension = (filename = "") => {
    return filename.split(".").pop().toLowerCase();
  };

  const getFileIcon = (item) => {
    if (!item.file_path) {
      return {
        icon: FaFolder,
        className: "text-yellow-600",
      };
    }

    const ext = getFileExtension(item.file_path);

    switch (ext) {
      case "doc":
      case "docx":
        return { icon: FaFileWord, className: "text-sky-600" };

      case "pdf":
        return { icon: FaFilePdf, className: "text-red-600" };

      case "csv":
      case "xls":
      case "xlsx":
        return { icon: FaFileExcel, className: "text-green-600" };

      case "ppt":
      case "pptx":
        return { icon: FaFilePowerpoint, className: "text-orange-600" };

      case "png":
      case "jpg":
      case "jpeg":
        return { icon: FaFileImage, className: "text-purple-600" };

      default:
        return { icon: FaFileAlt, className: "text-gray-600" };
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(ENDPOINTS.GUIDELINE_UPLOAD, formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const newFile = response.data.data;
      setGuidelines(prev => [newFile, ...prev]);

    } catch (error) {
      console.error("Upload gagal:", error);
    }
    event.target.value = "";
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSortMenu(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchGuidelines = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(ENDPOINTS.GUIDELINE_LIST);
        setGuidelines(response.data);
      } catch (error) {
        console.error("Gagal mengambil guideline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuidelines();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus dokumen ini?")) return;

    try {
      await api.delete(ENDPOINTS.GUIDELINE_DELETE(id));
      setGuidelines(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus dokumen:", error);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white rounded-lg border border-gray-300 text-blue-950 px-6 py-3 mb-4">
        <h2 className="text-lg font-semibold">Dokumen Terbaru</h2>
        <button
          onClick={handleUploadClick}
          className="flex items-center space-x-1 p-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>
      <div className={`bg-white rounded-lg border border-gray-300 ${isSidebar ? "px-4 py-2" : "p-0"}`}>
        {!isSidebar && (
          <div className="flex flex-row justify-between items-center p-4 border-b border-gray-300">
            <div className="flex items-center">
              <label htmlFor="entries" className="text-sm text-gray-700 mr-2">Show</label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span className="text-sm text-gray-700 mx-2 me-4">entries</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md pl-9 p-1 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 text-xs font-semibold items-center uppercase text-gray-500 border-b border-gray-300 py-3 px-4">
          <div className="col-span-1 flex justify-center">
            <DocumentTextIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div className={isSidebar ? "col-span-9 pl-2 relative" : "col-span-5 relative"}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSortMenu(showSortMenu === "name" ? null : "name");
              }}
              className="flex items-center gap-1 hover:text-blue-900 uppercase cursor-pointer"
            >
              Name
              <ChevronDownIcon
                className={`w-3 h-3 ml-1 transition-transform ${showSortMenu === "name" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showSortMenu === "name" && (
              <div className="absolute left-0 top-full mt-1 w-30 bg-white border-1 border-gray-300 rounded shadow text-xs z-50">
                <button
                  onClick={() => {
                    setSortConfig({ key: "title", type: "string", order: "asc" });
                    setShowSortMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Ascending
                </button>

                <button
                  onClick={() => {
                    setSortConfig({ key: "title", type: "string", order: "desc" });
                    setShowSortMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Descending
                </button>
              </div>
            )}
          </div>

          {!isSidebar && (
            <>
              <div className="hidden sm:block col-span-2 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortMenu(showSortMenu === "modified" ? null : "modified");
                  }}
                  className="flex items-center gap-1 hover:text-blue-900 uppercase cursor-pointer"
                >
                  Modified
                  <ChevronDownIcon
                    className={`w-3 h-3 transition-transform ${showSortMenu === "modified" ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showSortMenu === "modified" && (
                  <div className="absolute left-0 top-full mt-1 w-30 bg-white border-1 border-gray-300 rounded shadow-sm text-xs z-50">
                    <button
                      onClick={() => {
                        setSortConfig({ key: "updated_at", type: "date", order: "desc" });
                        setShowSortMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      Newer to Older
                    </button>

                    <button
                      onClick={() => {
                        setSortConfig({ key: "updated_at", type: "date", order: "asc" });
                        setShowSortMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      Older to Newer
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden sm:block col-span-2 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortMenu(showSortMenu === "modifiedBy" ? null : "modifiedBy");
                  }}
                  className="flex items-center gap-1 hover:text-blue-900 uppercase cursor-pointer"
                >
                  Modified By
                  <ChevronDownIcon
                    className={`w-3 h-3 ml-1 transition-transform ${showSortMenu === "modifiedBy" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {showSortMenu === "modifiedBy" && (
                  <div className="absolute left-0 top-full mt-1 w-30 bg-white border-1 border-gray-300 rounded shadow text-xs z-50">
                    <button
                      onClick={() => {
                        setSortConfig({ key: "updated_by", type: "string", order: "asc" });
                        setShowSortMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      A to Z
                    </button>

                    <button
                      onClick={() => {
                        setSortConfig({ key: "updated_by", type: "string", order: "desc" });
                        setShowSortMenu(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Z to A
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="col-span-1"></div>
        </div>

        {isLoading ? (
          <div className="flex py-6 flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-500">Loading...</span>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {displayedGuidelines.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-12 items-center py-3 text-sm hover:bg-gray-100 transition group px-4"
              >
                {/* Icon */}
                <div className="col-span-1 flex justify-center">
                  {(() => {
                    const { icon: FileIcon, className } = getFileIcon(item);
                    return <FileIcon className={`w-5 h-5 ${className}`} />;
                  })()}
                </div>

                {/* Name */}
                <div className={isSidebar ? "col-span-10 px-2" : "col-span-10 sm:col-span-5"}>
                  <a
                    href={ENDPOINTS.GUIDELINE_VIEW(item.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 text-xs font-medium hover:underline truncate block"
                    title={item.title}
                  >
                    {item.title}
                  </a>
                </div>

                {/* Modified */}
                {!isSidebar && (
                  <div className="hidden sm:block col-span-2 text-xs text-gray-600">
                    {dateFormatLong(item.updated_at)}
                  </div>
                )}

                {/* Modified By */}
                {!isSidebar && (
                  <div className="hidden sm:block col-span-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 group-hover:bg-gray-200 text-gray-700">
                      {item.updated_by}
                    </span>
                  </div>
                )}

                {/* Action */}
                <div className="col-span-1 flex justify-center pr-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:bg-red-200 rounded-md p-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between items-center p-4 border-t border-gray-300">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold">{Math.min(startIndex + 1, totalEntries)}</span> to{" "}
            <span className="font-semibold">{Math.min(endIndex, totalEntries)}</span> of{" "}
            <span className="font-semibold">{totalEntries}</span> entries
          </p>
          <nav className="flex justify-center items-center">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || totalPages === 0}
              className={`${buttonClass} ${currentPage === 1 || totalPages === 0 ? disabledClass : inactiveClass} font-semibold cursor-pointer`}
            >
              Back
            </button>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`${buttonClass} ${currentPage === totalPages || totalPages === 0 ? disabledClass : inactiveClass} font-semibold cursor-pointer`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default DocumentList;
