import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function NewsEdit({ isOpen, news, onClose, onSave }) {
  if (!isOpen || !news) return null;

  const STORAGE_BASE_URL = 'http://localhost:8000/storage/';

  const [formData, setFormData] = useState({
    title: news.title || "",
    publisher: news.publisher || "",
    deskripsi: news.deskripsi || "",
  });

  const [newThumbnail, setNewThumbnail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const getThumbnailUrl = (item) => {
    return item.thumbnail && !item.thumbnail.startsWith('http')
      ? `${STORAGE_BASE_URL}${item.thumbnail}`
      : item.thumbnail || 'https://placehold.co/400x225/e0e7ff/333?text=Current+Thumbnail';
  };

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        publisher: news.publisher || "",
        deskripsi: news.deskripsi || "",
      });
      setNewThumbnail(null);
      setThumbnailPreview(getThumbnailUrl(news));
    }
  }, [news]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewThumbnail(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(getThumbnailUrl(news));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const dataToSend = new FormData();
    dataToSend.append("_method", "PUT");
    dataToSend.append("title", formData.title);
    dataToSend.append("publisher", formData.publisher);
    dataToSend.append("deskripsi", formData.deskripsi);

    if (newThumbnail) {
      dataToSend.append("thumbnail", newThumbnail);
    }

    try {
      await onSave(news.slug, dataToSend);
      onClose();
    } catch (err) {
      setError("Gagal menyimpan berita. Cek konsol untuk detail error API.");
      console.error("Save news error:", err.response ? err.response.data : err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 overflow-y-auto p-4">
      <div className="bg-white w-full max-w-3xl my-6 p-6 rounded-2xl border border-gray-300 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <XMarkIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>

        <h3 className="text-2xl font-semibold mb-5 text-gray-800 text-center pb-3">
          Edit Berita
        </h3>

        {error && (
          <p className="text-red-500 text-sm mb-3 p-2 bg-red-100 rounded-lg">
            {error}
          </p>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-sm text-gray-700">
          <div className="space-y-4 col-span-3">
            <div>
              <label className="font-semibold block mb-1">Judul Berita</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Penulis</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-semibold block mb-1">Thumbnail</label>
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full mb-2 aspect-video object-cover rounded-lg border border-gray-300"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x225/e0e7ff/333?text=Failed+to+Load'; }}
              />
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div className="col-span-4">
            <label className="font-semibold block mb-1">Konten Berita</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="8"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-y"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6 pt-4">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg transition font-semibold text-white cursor-pointer ${isSaving ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold cursor-pointer text-gray-800"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsEdit;