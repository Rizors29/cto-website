import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { dateFormatLong } from "../../utils/dateFormat";
import NewsEdit from "./NewsEdit";

import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function NewsPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchNewsDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(ENDPOINTS.NEWS_DETAIL(slug));

      const apiData = response.data.data;

      if (response.data.success && apiData) {
        setNews(apiData);

        if (isLoading) {
          try {
            await api.post(ENDPOINTS.NEWS_VIEWS(slug));
          } catch (viewErr) {
            console.error("Failed to increment views:", viewErr);
          }
        }
      } else {
        setError("Detail berita tidak ditemukan atau gagal dimuat.");
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching news detail:", err);
      let errorMessage = "Gagal terhubung ke server atau berita tidak ada.";
      if (err.response && err.response.status === 404) {
        errorMessage = "Berita tidak ditemukan (404).";
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      setRole(userRole);
    }
  }, [slug]);

  const handleDelete = async (slug) => {
    if (isDeleting) return;
    if (!confirm(`Yakin ingin menghapus berita "${news.title}"?`)) return;

    setIsDeleting(true);

    try {
      await api.delete(ENDPOINTS.NEWS_DETAIL(slug));
      alert("Berita berhasil dihapus!");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus berita.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleSaveNews = async (slug, data) => {
    try {
      const response = await api.post(ENDPOINTS.NEWS_DETAIL(slug), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert("Berita berhasil diupdate!");
        await fetchNewsDetail();
        closeEditModal();
      } else {
        throw new Error(response.data.message || "Update gagal.");
      }

    } catch (err) {
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 pt-24 min-h-screen bg-gray-50 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (news) {
    const coverImageUrl = news.thumbnail
      ? news.thumbnail.startsWith('http') ? news.thumbnail : ENDPOINTS.NEWS_STORAGE(news.thumbnail)
      : 'https://placehold.co/800x450/a3bffa/333?text=No+Image';

    const updatedAtText = news.updated_at && news.updated_at !== news.created_at
      ? `Diupdate: ${dateFormatLong(news.updated_at)}`
      : '';

    const editorText = news.updated_at && news.updated_at !== news.created_at
      ? `Diedit oleh: ${news.publisher}`
      : `Oleh: ${news.publisher}`;

    return (
      <>
        <NewsEdit
          isOpen={isEditModalOpen}
          news={news}
          onClose={closeEditModal}
          onSave={handleSaveNews}
        />

        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border-1 border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="flex items-center space-x-1 p-2 text-blue-950 rounded-md font-medium hover:bg-gray-100 cursor-pointer">
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </Link>
              {role === "admin" && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-800 cursor-pointer"
                    onClick={openEditModal}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 text-white rounded-lg cursor-pointer ${isDeleting ? 'bg-red-300' : 'bg-red-500 hover:bg-red-700'}`}
                    onClick={() => handleDelete(news.slug)}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <img
              src={coverImageUrl}
              alt={news.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-6"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/a3bffa/333?text=No+Image'; }}
            />

            <h1 className="text-3xl font-semibold text-gray-800 mb-4">{news.title}</h1>

            <div className="text-sm text-gray-500 mb-6 border-b border-gray-300 pb-4 flex justify-between items-center flex-wrap gap-2">
              <span>{editorText}</span>
              <span>Dibuat: {dateFormatLong(news.created_at)}</span>
              {updatedAtText && <span>{updatedAtText}</span>}
              <span>Dilihat: {news.views || 0} kali</span>
            </div>

            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {news.deskripsi}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gray-50 text-center text-gray-500">
      Berita tidak tersedia.
    </div>
  );
}

export default NewsPage;