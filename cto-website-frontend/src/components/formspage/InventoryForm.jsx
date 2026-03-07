import { useState } from 'react';
import api from '../../utils/api';
import ENDPOINTS from '../../utils/endpoint';

function InventoryForm() {
  const [formData, setFormData] = useState({
    nama: '',
    category: '',
    brand: '',
    type: '',
    serial_number: '',
    start_date: '',
    end_date: '',
    attachment_file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const typesByBrand = {
    Lenovo: [
      "Lenovo Thinkpad E14 G5 ( i7 - 13700H )",
      "Lenovo Thinkpad E14 G5 ( i5 - 1335U )",
      "Lenovo Thinkpad L13, 16GB, 1024GB",
      "Lenovo Thinkpad L13, 8GB, 512GB"
    ],
    Apple: [
      'Apple Macbook Air 13", 8GB, 512GB',
      'Apple Macbook Air 13", 8GB, 256GB',
      'Apple Macbook Air 13", 8GB, 128GB',
      'Apple Macbook Pro 13"'
    ]
  };

  const categories = [
    'High Performance',
    'High Mobility',
    'High Performance - High Mobility',
    'Administrative Non IT'
  ];

  const brands = ['Lenovo', 'Apple'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      setFormData(prev => ({ ...prev, brand: value, type: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      category: '',
      brand: '',
      type: '',
      serial_number: '',
      start_date: '',
      end_date: '',
      attachment_file: null,
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    const dataToSend = new FormData();

    dataToSend.append('nama_karyawan', formData.nama);
    dataToSend.append('kategori', formData.category);
    dataToSend.append('merk', formData.brand);
    dataToSend.append('type', formData.type);
    dataToSend.append('serial_number', formData.serial_number);
    dataToSend.append('tgl_mulai_sewa', formData.start_date);
    dataToSend.append('tgl_berakhir_sewa', formData.end_date);

    try {
      await api.post(ENDPOINTS.SUBMIT_INVENTORY, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage('Data inventory berhasil disimpan.');
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat koneksi ke server.';

      if (validationErrors) {
        const errorDetails = Object.keys(validationErrors)
          .map(key => `${key}: ${validationErrors[key].join(', ')}`)
          .join('\n');
        errorMessage = `Validasi gagal:\n${errorDetails}`;
      }

      setError(errorMessage);
      console.error("Submission Error:", err.response || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (message) {
    return (
      <div>
        <div className="relative w-full max-w-xl mx-auto my-8 p-10 rounded-lg bg-white text-center border-1 border-gray-300">
          <svg className="mx-auto h-16 w-16 text-green-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <h2 className="text-3xl font-bold text-gray-800 mt-4">Sukses!</h2>
          <p className="text-lg text-gray-600 mt-2">{message}</p>
          <div className="mt-8 flex justify-center space-x-4">
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-blue-950/90 hover:bg-blue-950 transition duration-150"
            >
              Back to Home
            </a>
            <button
              onClick={resetForm}
              className="inline-flex bg-gray-200 items-center cursor-pointer px-4 py-2 hover:bg-gray-300 text-sm font-medium rounded-lg transition duration-150"
            >
              Submit New Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl border-1 border-gray-300">
      <h2 className="text-xl font-semibold text-blue-950 pb-6 text-center">Formulir Inventory</h2>

      {error && (
        <p className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
            1. Nama Lengkap <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            placeholder="Masukkan nama lengkap"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Kategori Perangkat <span className='text-red-500'>*</span>
          </label>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-300">
            {categories.map(cat => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input
                  id={cat}
                  type="radio"
                  name="category"
                  value={cat}
                  checked={formData.category === cat}
                  onChange={handleChange}
                  required
                  className="h-5 w-5 text-blue-950 border-gray-300 cursor-pointer"
                />
                <span className="ml-4 text-base text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            3. Merek Perangkat <span className='text-red-500'>*</span>
          </label>
          <div className="flex space-x-6">
            {brands.map(brand => (
              <label key={brand} className="flex items-center cursor-pointer">
                <input
                  id={brand}
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={formData.brand === brand}
                  onChange={handleChange}
                  required
                  className="h-5 w-5 text-blue-950 border-gray-300 cursor-pointer"
                />
                <span className="ml-3 text-base text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.brand && (
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
              4. Type Model <span className='text-red-500'>*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Type Model --</option>
              {typesByBrand[formData.brand].map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="serial_number" className="block text-sm font-semibold text-gray-700 mb-2">
            5. Serial Number <span className='text-red-500'>*</span>
          </label>
          <input
            id="serial_number"
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
            placeholder="Serial number perangkat"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
            6. Tanggal Mulai Sewa <span className='text-red-500'>*</span>
          </label>
          <input
            id="start_date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
            7. Tanggal Berakhir Sewa <span className='text-red-500'>*</span>
          </label>
          <input
            id="end_date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
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
              "Submit Inventory"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;