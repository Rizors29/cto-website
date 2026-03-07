import { useEffect, useState } from "react";
import filterTableData from "../../utils/filterTableData";
import InventoryDetail from "./InventoryDetail";
import InventoryEdit from "./InventoryEdit";
import { dateFormatLong } from "../../utils/dateFormat";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function InventoryTable({ year, mode }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    const fetchInventoryTable = async () => {
      setIsLoading(true);

      try {
        let endpoint = ENDPOINTS.INVENTORY;

        if (mode === "dashboard" && year) {
          endpoint += `?year=${year}`;
        }

        const response = await api.get(endpoint);
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("InventoryTable error:", err.response);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryTable();
  }, [year]);

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

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDownload = () => {
    const excelData = filteredData.map((row) => ({
      "Nama": row.nama_karyawan,
      "Kategori": row.kategori,
      "Merek": row.merk,
      "Tipe": row.type,
      "Serial Number": row.serial_number,
      "Tanggal Mulai Sewa": dateFormatLong(row.tgl_mulai_sewa),
      "Tanggal Berakhir Sewa": dateFormatLong(row.tgl_berakhir_sewa),
      "Sisa Masa Sewa": row.sisa_masa_sewa,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    XLSX.writeFile(workbook, `Inventory_${new Date().getTime()}.xlsx`);
  };

  const handleSave = async (id, data) => {
    try {
      await api.put(ENDPOINTS.INVENTORY_DETAIL(id), data);
      setData(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
      closeModal();
    } catch (err) {
      console.error("Error saving inventory item:", err);
      throw new Error('Failed to save data. Check API connection and data format.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus inventory ini?")) return;

    try {
      await api.delete(ENDPOINTS.INVENTORY_DETAIL(id));

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="flex-none md:flex justify-between items-center bg-white rounded-lg p-6 mb-4 border-1 border-gray-300">
        {mode === "dashboard" ? (
          <h2 className="text-2xl font-semibold text-blue-950 me-6">Inventory List</h2>
        ) : (
          <h2 className="text-2xl font-semibold text-blue-950 me-6">Inventory Operation</h2>
        )}
        <span className="flex my-2 md:my-0 space-x-3">
          {filteredData.length > 0 && (
            <button
              onClick={handleDownload}
              className="cursor-pointer flex items-center space-x-1 bg-green-600 hover:bg-green-700 rounded-lg py-2 px-3 text-white font-semibold transition-colors"
            >
              <PiMicrosoftExcelLogoFill className="w-4 h-4" />
              <span>
                Export
                <span className="hidden sm:inline"> to Excel</span>
              </span>
            </button>
          )}
          {role === "internal" && (
            <Link to="/inventory-form" className="bg-blue-950/90 hover:bg-blue-950 rounded-lg py-2 px-3 text-white font-semibold">
              Ajukan Inventory
            </Link>
          )}
        </span>
      </div>

      <div className="flex flex-row justify-between items-center bg-white p-4 rounded-t-lg border-t border-l border-r border-gray-300">
        <div className="flex items-center">
          <label htmlFor="entries" className="text-sm text-gray-700 mr-2">Show</label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-1 text-sm"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-b-lg bg-white border-1 border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Merek</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Mulai Sewa</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sisa Masa Sewa</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : displayedData.length > 0 ? (
              displayedData.map((row) => (
                <tr
                  key={row.id || row.tgl_mulai_sewa}
                  className="hover:bg-gray-100 transition duration-150"
                >
                  <td className="px-4 py-2 text-sm text-gray-900">{row.nama_karyawan}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.kategori}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.merk}</td>

                  <td className="px-4 py-2 text-sm text-gray-500">
                    {dateFormatLong(row.tgl_mulai_sewa)}
                  </td>

                  <td className="px-4 py-2 text-sm text-gray-500">{row.sisa_masa_sewa}</td>
                  <td className="px-4 py-1">
                    {mode === "dashboard" ? (
                      <div className="flex justify-center">
                        <button className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-800 cursor-pointer" onClick={() => openModal(row)}>
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center space-x-2">
                        <button className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-800 cursor-pointer" onClick={() => openModal(row)}>
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer" onClick={() => handleDelete(row.id)}>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                  Tidak ada data inventory yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 bg-white rounded-b-xl border-1 border-gray-300">
        <p className="text-sm text-gray-700 mb-2 sm:mb-0">
          Showing <span className="font-semibold">{Math.min(startIndex + 1, totalEntries)}</span> to{" "}
          <span className="font-semibold">{Math.min(endIndex, totalEntries)}</span> of{" "}
          <span className="font-semibold">{totalEntries}</span> entries
        </p>

        {/* Paginasi Controls */}
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
      {mode === "dashboard" ? (
        <InventoryDetail
          isOpen={isModalOpen}
          item={selectedItem}
          onClose={closeModal}
          onApprove={(id) => {
            handleApprove(id);
            closeModal();
          }}
          onDone={(id) => {
            handleDone(id);
            closeModal();
          }}
        />
      ) : (
        <InventoryEdit
          isOpen={isModalOpen}
          item={selectedItem}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default InventoryTable;