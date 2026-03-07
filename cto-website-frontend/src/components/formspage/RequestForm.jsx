import { useState } from 'react';
import api from '../../utils/api';
import ENDPOINTS from '../../utils/endpoint';

function RequestForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    attachment_file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attachment_file: e.target.files[0] }));
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '', attachment_file: null });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
    dataToSend.append('category', formData.category);

    if (formData.attachment_file) {
      dataToSend.append('attachment_file', formData.attachment_file);
    }

    try {
      await api.post(ENDPOINTS.SUBMIT_REQUEST, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage('Permintaan Layanan Anda berhasil dikirim.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat mengirim permintaan.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['PC/VDI/Server', 'Email', 'Laptop', 'Printer', 'Tableau', 'Percobaan'];

  if (message) {
    return (
      <div className="relative w-full max-w-xl mx-auto my-8 p-10 rounded-lg bg-white text-center border-1 border-gray-300">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h2 className="text-3xl font-bold text-gray-800 mt-4">Sukses!</h2>
        <p className="text-lg text-gray-600 mt-2">{message}</p>

        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950/90 hover:bg-blue-950"
          >
            Back to Home
          </a>
          <button
            onClick={resetForm}
            className="inline-flex bg-gray-200 items-center cursor-pointer px-4 py-2 hover:bg-gray-300 text-sm font-medium rounded-md transition duration-150"
          >
            Submit New Request
          </button>
        </div>
      </div>

    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl border-1 border-gray-300">
      <h2 className="text-xl font-semibold text-blue-950 pb-6 text-center">Formulir IT Service Request</h2>

      {error && (
        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Judul Request */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">1. Judul Request <span className="text-red-500">*</span></label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul request" required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        {/* 2. Deskripsi Request */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">2. Deskripsi Request <span className="text-red-500">*</span></label>
          <textarea name="description" id="description" rows="4" placeholder="Deskripsikan request" value={formData.description} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>

        {/* 3. Jenis Kendala IT Support */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">3. Jenis Kendala IT Support <span className="text-red-500">*</span></label>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-300">
            {categories.map(cat => (
              <div className="flex items-center" key={cat}>
                <input
                  id={cat}
                  name="category"
                  type="radio"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                  required
                  className="h-5 w-5 text-sky-600 border-gray-300 cursor-pointer"
                />
                <label htmlFor={cat} className="ml-4 text-base text-gray-700 cursor-pointer">{cat}</label>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Attachment */}
        <div>
          <label htmlFor="attachment_file" className="block text-sm font-medium text-gray-700 mb-2">4. Screenshot foto atau video kendala</label>
          <input type="file" name="attachment_file" id="attachment_file" onChange={handleFileChange} className="cursor-pointer mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-950/90 hover:bg-blue-950 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-white">Submitting...</span>
                </div>
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestForm;