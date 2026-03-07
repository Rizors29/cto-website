import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CATEGORY_OPTIONS = [
  "High Mobility",
  "High Performance",
  "Administrative Non IT",
  "Standard IT",
];

const MERK_OPTIONS = [
  "Lenovo",
  "Apple",
];

const TYPE_OPTIONS = {
  Lenovo: [
    "Lenovo Thinkpad L13, 16GB, 1024GB",
    "Lenovo Thinkpad L13, 8GB, 512GB",
    "Lenovo Thinkpad E14 G5 ( i5 - 1335U )",
    "Lenovo Thinkpad E14 G5 ( i7 - 13700H )"
  ],
  Apple: [
    'Apple Macbook Air 13", 8GB, 512GB',
    'Apple Macbook Air 13", 8GB, 256GB',
    'Apple Macbook Air 13", 8GB, 128GB',
    'Apple Macbook Pro 13"'
  ],
};

function InventoryEdit({ isOpen, item, onClose, onSave }) {

  if (!isOpen || !item) return null;

  const getCurrentTypes = (merk) => TYPE_OPTIONS[merk] || [];

  const initialMerk = item.merk || MERK_OPTIONS[0] || '';
  const initialTypeOptions = getCurrentTypes(initialMerk);

  const [formData, setFormData] = useState({
    nama_karyawan: item.nama_karyawan || '',
    kategori: item.kategori || CATEGORY_OPTIONS[0] || '',
    merk: initialMerk,
    type: item.type || (initialTypeOptions.length > 0 ? initialTypeOptions[0] : ''),
    serial_number: item.serial_number || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      const itemMerk = item.merk || MERK_OPTIONS[0] || '';
      const itemTypeOptions = getCurrentTypes(itemMerk);

      setFormData({
        nama_karyawan: item.nama_karyawan || '',
        kategori: item.kategori || CATEGORY_OPTIONS[0] || '',
        merk: itemMerk,
        type: item.type || (itemTypeOptions.length > 0 ? itemTypeOptions[0] : ''),
        serial_number: item.serial_number || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (name === 'merk') {
        const newTypes = getCurrentTypes(value);
        return {
          ...prev,
          [name]: value,
          type: newTypes.length > 0 ? newTypes[0] : '',
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(item.id, formData);
      onClose();
    } catch (err) {
      setError('Gagal menyimpan data. Cek koneksi API dan format data.');
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTypeOptions = getCurrentTypes(formData.merk);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
      <div className="bg-white w-full max-w-md p-6 mx-3 rounded-2xl border border-gray-300 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <XMarkIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-bold mb-5 text-gray-800 text-center">
          Detail Perangkat
        </h3>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </p>
        )}

        {/* Form Content */}
        <div className="space-y-4 text-sm text-gray-700">

          {/* Nama Karyawan */}
          <div>
            <label className="font-semibold block mb-1">Nama Karyawan</label>
            <input
              type="text"
              name="nama_karyawan"
              value={formData.nama_karyawan}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="font-semibold block mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {/* Opsi Kategori */}
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Merek */}
          <div>
            <label className="font-semibold block mb-1">Merek</label>
            <select
              name="merk"
              value={formData.merk}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {MERK_OPTIONS.map((merk) => (
                <option key={merk} value={merk}>
                  {merk}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="font-semibold block mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!formData.merk || currentTypeOptions.length === 0}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
            >
              {currentTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Serial Number */}
          <div>
            <label className="font-semibold block mb-1">Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleSave}
            className={`flex-1 py-2 rounded-lg transition font-semibold text-white cursor-pointer ${isSaving ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
              }`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryEdit;