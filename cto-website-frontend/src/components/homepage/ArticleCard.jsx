import { UserIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { dateFormatShort } from "../../utils/dateFormat"

function ArticleCard({ imgSrc, title, author, created_at, description, views, slug }) {
  const imageSource = imgSrc
    ? imgSrc.startsWith('http') ? imgSrc : `http://localhost:8000/storage/${imgSrc}`
    : "https://placehold.co/600x200/a3bffa/333?text=News";

  return (
    <Link to={`/news/${slug}`} className="block h-full">
      <div className="bg-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden cursor-pointer border-1 border-gray-300 h-full flex flex-col">
        <img
          src={imageSource}
          alt={title}
          className="w-full h-40 object-cover flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x200/a3bffa/333?text=News"; }}
        />

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1 min-h-[3.75rem]">
            {description}
          </p>

          <div className="flex justify-between items-center font-medium text-xs pt-2 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-2 text-gray-700">
              <UserIcon className="w-4 h-4 text-gray-700" />
              <span className="uppercase truncate max-w-[110px]">{author}</span>
              <span className="text-gray-500 whitespace-nowrap">{dateFormatShort(created_at)}</span>
            </div>
            <div className="flex items-center hidden md:flex space-x-2 text-gray-500">
              <EyeIcon className="w-4 h-4 text-blue-950" />
              <span className="whitespace-nowrap">{views} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;