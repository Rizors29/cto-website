import { useEffect, useState } from "react";
import ArticleCard from "../homepage/ArticleCard";
import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

function NewsList() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const response = await api.get(ENDPOINTS.NEWS);

        if (response.data?.data?.data) {
          setNews(response.data.data.data);
        }
        else if (Array.isArray(response.data?.data)) {
          setNews(response.data.data);
        }
        else if (Array.isArray(response.data)) {
          setNews(response.data);
        }
        else {
          setNews([]);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat daftar berita.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 text-blue-950">
      <div className="flex justify-between bg-white px-8 py-4 rounded-lg border-1 border-gray-300 mb-4">
        <h1 className="text-3xl font-semibold">Semua Berita</h1>
        <Link to="/news-form" className="flex items-center space-x-1 p-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer">
          <PlusIcon className="w-5 h-5" />
          <span>New</span>
        </Link>
      </div>
      <div className="bg-white p-10 rounded-xl border-1 border-gray-300">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-500">Loading...</span>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-500">
            Tidak ada berita.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </div>
    </section>
  );
}

export default NewsList;
