import { XMarkIcon } from "@heroicons/react/24/solid";
import ENDPOINTS from "../../utils/endpoint";
import { dateFormatLong } from "../../utils/dateFormat";

function RequestDetail({ isOpen, item, onClose, onApprove, onReject, onDone, mode }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
      <div className="bg-white w-full max-w-sm p-6 mx-3 rounded-2xl border border-gray-300 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <XMarkIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-bold mb-5 text-gray-800 text-center">
          Detail Request
        </h3>

        {/* Content */}
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold">Nama</p>
            <p className="text-gray-600">{item.username}</p>
          </div>

          <div>
            <p className="font-semibold">Judul</p>
            <p className="text-gray-600">{item.judul_request}</p>
          </div>

          <div>
            <p className="font-semibold">Deskripsi</p>
            <p className="text-gray-600">{item.deskripsi}</p>
          </div>

          <div>
            <p className="font-semibold">Kategori</p>
            <p className="text-gray-600">{item.jenis_kendala}</p>
          </div>

          <div>
            <p className="font-semibold">Status</p>
            <span
              className={`px-2 py-1 inline-block rounded-md text-xs font-semibold text-white
                ${item.status === "New" ? "bg-sky-500" :
                  item.status === "Rejected" ? "bg-red-500" :
                    item.status === "In Progress" ? "bg-yellow-500" :
                      "bg-green-600"}`}
            >
              {item.status}
            </span>
          </div>

          {item.approved_at && (
            item.status === "Rejected" ? (
              <div>
                <p className="font-semibold">Tanggal Reject</p>
                <p className="text-gray-600">{dateFormatLong(item.approved_at)}</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Tanggal Approve</p>
                <p className="text-gray-600">{dateFormatLong(item.approved_at)}</p>
              </div>
            )
          )}

          {item.done_at && (
            <div>
              <p className="font-semibold">Tanggal Done</p>
              <p className="text-gray-600">{dateFormatLong(item.done_at)}</p>
            </div>
          )}

          <div>
            <p className="font-semibold mb-1">Lampiran</p>
            {item.attachment_path ? (
              <button
                onClick={() =>
                  window.open(ENDPOINTS.REQUEST_STORAGE(item.attachment_path), "_blank")
                }
                className="bg-white border border-gray-300 px-2 py-1 font-semibold rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Lihat File
              </button>
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada file lampiran</p>
            )}
          </div>
        </div>

        {mode === "operation" && (
          <div className="mt-6">
            {item.status === "New" && (
              <div className="flex gap-3">
                <button
                  onClick={() => onApprove(item.id)}
                  className="flex-1 bg-green-600 py-2 text-white rounded-lg hover:bg-green-800 transition font-semibold cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(item.id)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition font-semibold cursor-pointer"
                >
                  Reject
                </button>
              </div>
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
        )}
      </div>
    </div>
  );
}

export default RequestDetail;
