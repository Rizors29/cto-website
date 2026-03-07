import ArticleCard from "./ArticleCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function NewsSection() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`${ENDPOINTS.NEWS}?limit=4`);

        if (response.data && Array.isArray(response.data.data)) {
          setNews(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setNews(response.data);
        } else {
          console.warn("API response structure unexpected:", response.data);
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Gagal mengambil data berita dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const gridClasses = news.length === 1
    ? "grid grid-cols-1 gap-6 px-6 pb-6 rounded-lg"
    : "grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6 rounded-lg";

  return (
    <section>
      <div className="flex justify-between items-center bg-white rounded-lg border border-gray-300 text-blue-950 py-4 px-8 mb-4">
        <h2 className="text-2xl font-semibold">Berita Terbaru</h2>
      </div>

      <div className="bg-white p-2 rounded-lg border-1 border-gray-300">
        <div className="flex justify-between px-6 pt-4 mb-2 text-blue-950">
          <Link to="/news-form" className="flex items-center space-x-1 p-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer">
            <PlusIcon className="w-5 h-5" />
            <span>New</span>
          </Link>
          <Link to="/news-list" className="space-x-1 p-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer">
            See all
          </Link>
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-500">Loading...</span>
          </div>
        )}

        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-3 m-6 text-center">
            {error}
          </p>
        )}

        {!isLoading && !error && news.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-3 m-6 text-center">
            Belum ada berita yang diterbitkan.
          </div>
        )}

        <div className={gridClasses}>
          {news.map((article) => (
            <ArticleCard
              key={article.id}
              imgSrc={article.thumbnail}
              title={article.title}
              created_at={article.created_at}
              description={article.deskripsi}
              author={article.publisher}
              views={article.views || 0}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section> 
  );
}

export default NewsSection;