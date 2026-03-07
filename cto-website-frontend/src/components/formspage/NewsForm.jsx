import { useState } from 'react';
import api from '../../utils/api';
import ENDPOINTS from '../../utils/endpoint';

function NewsForm() {
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    deskripsi: '',
    thumbnail: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSuccess(null);
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      thumbnail: file
    }));
    setSuccess(null);
    setError(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.title || !formData.deskripsi) {
      setError("Judul, Konten, dan Thumbnail berita tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('deskripsi', formData.deskripsi);
    dataToSend.append('publisher', formData.publisher);

    const generatedSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    dataToSend.append('slug', generatedSlug);

    if (formData.thumbnail) {
      dataToSend.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await api.post(ENDPOINTS.PUBLISH_NEWS, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess(`Berita "${formData.title}" berhasil dipublikasikan.`);
      } else {
        setError(response.data.message || 'Gagal menyimpan berita.');
        return;
      }

      setFormData({ title: '', publisher: '', deskripsi: '', thumbnail: null });
      document.getElementById('thumbnail').value = '';

    } catch (err) {
      console.error("News submission error:", err.response || err);

      let errorMessage = 'Gagal mempublikasikan berita. Silakan coba lagi.';

      if (err.response && err.response.status === 422 && err.response.data.errors) {
        const errors = err.response.data.errors;
        const validationMessages = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join(' | ');
        errorMessage = `Validasi Gagal: ${validationMessages}`;
      } else if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-blue-950 text-center">
        Formulir Berita Baru
      </h2>

      {error && (
        <p className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 border border-red-400">
          {error}
        </p>
      )}
      {success && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 border border-green-400">
          <span className="font-bold">Sukses!</span> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Judul Berita */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            1. Judul Berita <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul berita"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            disabled={isLoading}
          />
        </div>

        {/* Input Penulis (Publisher) */}
        <div>
          <label htmlFor="publisher" className="block text-sm font-semibold text-gray-700 mb-2">
            2. Penulis <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Nama penulis atau publisher"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            disabled={isLoading}
          />
        </div>

        {/* Konten Berita (Deskripsi) */}
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-2">
            3. Konten Berita <span className='text-red-500'>*</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Tulis isi berita secara lengkap"
            rows="10"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none transition duration-150"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-700 mb-2">
            4. Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleFileChange}
            className="cursor-pointer mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
            accept=".jpg,.jpeg,.png,.mp4,.mov"
          />
          {formData.thumbnail && (
            <p className="text-xs mt-1 text-gray-500">File terpilih: {formData.thumbnail.name}</p>
          )}
        </div>


        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-950/90 hover:bg-blue-950 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex flex-row items-center justify-center space-x-2">
                <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-white">Publishing...</span>
              </div>
            ) : (
              "Publish News"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewsForm;