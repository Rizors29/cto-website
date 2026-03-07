import { dateFormatLong } from "../../utils/dateFormat";
import { XMarkIcon } from "@heroicons/react/24/solid";

function InventoryDetail({ isOpen, item, onClose, onApprove, onDone }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl border-1 border-gray-300 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <XMarkIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>

        <h3 className="text-xl font-bold mb-5 text-gray-800 text-center">
          Detail Perangkat
        </h3>

        <div className="space-y-4 text-sm text-gray-700">

          <div>
            <p className="font-semibold">Nama</p>
            <p className="text-gray-600">{item.nama_karyawan}</p>
          </div>

          <div>
            <p className="font-semibold">Kategori</p>
            <p className="text-gray-600">{item.kategori}</p>
          </div>

          <div>
            <p className="font-semibold">Merek</p>
            <p className="text-gray-600">{item.type}</p>
          </div>

          <div>
            <p className="font-semibold">Serial Number</p>
            <p className="text-gray-600">{item.serial_number}</p>
          </div>

          <div>
            <p className="font-semibold">Tanggal Mulai Sewa</p>
            <p className="text-gray-600">{dateFormatLong(item.tgl_mulai_sewa)}</p>
          </div>

          <div>
            <p className="font-semibold">Tanggal Berakhir Sewa</p>
            <p className="text-gray-600">{dateFormatLong(item.tgl_berakhir_sewa)}</p>
          </div>

          <div>
            <p className="font-semibold">Sisa Masa Sewa</p>
            <p className="text-gray-600">{item.sisa_masa_sewa}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          {item.status === "New" && (
            <button
              onClick={() => onApprove(item.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition font-semibold cursor-pointer"
            >
              Approve
            </button>
          )}

          {item.status === "In Progress" && (
            <button
              onClick={() => onDone(item.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition font-semibold cursor-pointer"
            >
              Mark Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryDetail;
