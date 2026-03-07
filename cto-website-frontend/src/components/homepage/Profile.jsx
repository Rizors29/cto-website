import { useEffect, useState, useRef } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function Profile() {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tempName, setTempName] = useState("");
  const [tempPhoto, setTempPhoto] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(ENDPOINTS.PROFILE);

        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role);

        setPhoto(
          response.data.photo
            ? `http://localhost:8000/storage/${response.data.photo}`
            : ""
        );
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openModal = () => {
    setTempName(name);
    setTempPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", tempName);

      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      const response = await api.post(ENDPOINTS.PROFILE_UPDATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName(tempName);

      if (response.data.photo_url) {
        localStorage.setItem("photo", response.data.photo_url);

        window.dispatchEvent(new Event("storage"));
        setPhoto(response.data.photo_url);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Gagal menyimpan profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setTempPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="flex justify-center items-start px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-6 border border-gray-300">
        {isLoading ? (
          <div className="w-8 h-8 border-3 border-black/50 m-auto my-30 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-300" />
              )}
              <h1 className="text-xl font-semibold text-gray-800 mt-2">{name}</h1>
              <p className="text-sm text-gray-500">Account Information</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-300">
                <EnvelopeIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-300">
                <IdentificationIcon className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium capitalize text-gray-800">
                    {role || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={openModal}
                className="w-full py-2 rounded-lg bg-blue-950/90 text-white font-semibold hover:bg-blue-950 transition cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 mx-3 relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <XMarkIcon className="w-5 h-5 text-gray-700 cursor-pointer" />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>

            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300">
                  {tempPhoto ? (
                    <img
                      src={tempPhoto}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-gray-300" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-blue-950/90 p-2 rounded-full text-white hover:bg-blue-950 cursor-pointer transition-all border-2 border-white"
                >
                  <PencilIcon className="w-3 h-3" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-semibold">
                Maksimal 2 MB
              </p>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={role === "admin"}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 py-2 rounded-lg transition font-semibold text-white cursor-pointer ${isSaving ? 'bg-blue-950/50' : 'bg-blue-950/90 hover:bg-blue-950'}`}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
