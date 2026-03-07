import { useEffect, useState } from "react";
import { dateFormatLong } from "../../utils/dateFormat";
import filterTableData from "../../utils/filterTableData";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import RequestDetail from "./RequestDetail"
import * as XLSX from "xlsx";

import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function RequestTable({ endpoint, role = "internal", mode = "dashboard" }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequestTable = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(endpoint);
        setData(response.data?.data || []);
      } catch (err) {
        console.error("RequestTable error:", err.response);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestTable();
  }, [endpoint]);

  const filteredData = filterTableData(data, searchTerm);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedData = filteredData.slice(startIndex, endIndex);

  const buttonClass = "px-3 py-1 mx-1 text-sm rounded-lg transition-colors duration-150 ease-in-out";
  const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const disabledClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const handleDownload = () => {
    const excelData = filteredData.map((item) => ({
      "Nama": item.username,
      "Judul Request": item.judul_request,
      "Kategori": item.jenis_kendala,
      "Tanggal Request": dateFormatLong(item.created_at),
      "Status": item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

    XLSX.writeFile(workbook, `IT_Service_Request_${new Date().getTime()}.xlsx`);
  };

  const handleApprove = async (id) => {
    try {
      const response = await api.put(ENDPOINTS.REQUEST_APPROVED(id));
      const updatedItem = response.data.data;

      setData(prevData =>
        prevData.map(item =>
          item.id === id ? updatedItem : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDone = async (id) => {
    try {
      const response = await api.put(ENDPOINTS.REQUEST_DONE(id), {
        status: "Done",
        done_at: new Date().toISOString()
      });

      const updated = response.data.data;

      setData(prev =>
        prev.map(item =>
          item.id === id ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.put(ENDPOINTS.REQUEST_REJECTED(id), {
        status: "Rejected",
        done_at: new Date().toISOString()
      });

      const updated = response.data.data;

      setData(prev =>
        prev.map(item =>
          item.id === id ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus request ini?")) return;

    try {
      await api.delete(ENDPOINTS.REQUEST_DETAIL(id));

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="flex-none sm:flex justify-between items-center bg-white rounded-lg p-6 mb-4 border-1 border-gray-300">
        {mode === "dashboard" ? (
          <h2 className="text-2xl font-semibold text-blue-950 me-6">IT Service Request List</h2>
        ) : (
          <h2 className="md:text-2xl text-xl font-semibold text-blue-950 me-6">IT Service Request Operation</h2>
        )}
        <span className="flex my-2 md:my-0 space-x-3">
          {filteredData.length > 0 && (
            <button
              onClick={handleDownload}
              className="cursor-pointer flex items-center space-x-1 bg-green-600 hover:bg-green-700 rounded-lg py-2 px-3 px-full text-white font-semibold transition-colors"
            >
              <PiMicrosoftExcelLogoFill className="w-4 h-4" />
              <span>
                Export
                <span className="hidden sm:inline"> to Excel</span>
              </span>
            </button>
          )}
          {role === "internal" && (
            <Link
              to="/request-form"
              className="bg-blue-950/90 hover:bg-blue-950 rounded-lg py-2 px-3 text-white font-semibold"
            >
              Ajukan Request
            </Link>
          )}
        </span>
      </div>

      <div className="flex flex-row justify-between items-center bg-white p-4 rounded-t-lg border-r border-t border-l border-gray-300">
        <div className="flex items-center">
          <label htmlFor="entries" className="text-sm text-gray-700 mr-2">Show</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700 mx-2 me-4">entries</span>
        </div>

        {/* Searchbar */}
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

      {/* Table Container */}
      <div className="overflow-x-auto rounded-b-lg bg-white border-1 border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">

          {/* Table Header */}
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Request</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kelola</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              displayedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.judul_request}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.jenis_kendala}</td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {dateFormatLong(row.created_at)}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${row.status === 'New' ? 'bg-sky-400 text-white' :
                      row.status === 'Rejected' ? 'bg-red-500 text-white' :
                        row.status === 'In Progress' ? 'bg-yellow-400 text-white' :
                          row.status === 'Done' ? 'bg-green-500 text-white' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {row.status}
                    </span>
                  </td>

                  <td className="px-4 py-1">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-800 cursor-pointer"
                        onClick={() => openModal(row)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {mode === "operation" && (
                        <button
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(row.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-sm text-gray-500">
                  Tidak ada data request yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Table */}
      <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-b-lg border-1 border-gray-300">
        <p className="text-sm text-gray-700">
          Showing<span className="font-semibold mx-1">1</span>to
          <span className="font-semibold mx-1">{Math.min(entriesPerPage, filteredData.length)}</span>of
          <span className="font-semibold mx-1">{data.length}</span>entries
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

      <RequestDetail
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={closeModal}
        onApprove={(id) => {
          handleApprove(id);
          closeModal();
        }}
        onReject={(id) => {
          handleReject(id);
          closeModal();
        }}
        onDone={(id) => {
          handleDone(id);
          closeModal();
        }}
        mode={mode}
      />

    </div>
  );
}

export default RequestTable;