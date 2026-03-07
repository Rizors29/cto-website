import YoutubePlayer from "./YoutubePlayer";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const youtubeSlides = [
  {
    id: 0,
    youtubeVideoId: "TL2PRJMt_Sk",
    thumbnailUrl: "https://img.youtube.com/vi/TL2PRJMt_Sk/maxresdefault.jpg",
    altText: "Video Before After CPU",
    title: "How to Fix 100% CPU Usage Windows 10",
  },
  {
    id: 1,
    youtubeVideoId: "tjZuhRjojqE",
    thumbnailUrl: "https://img.youtube.com/vi/tjZuhRjojqE/maxresdefault.jpg",
    altText: "Video Before After CPU",
    title: "Panduan Mengatasi Local Disk C Penuh",
  },
  {
    id: 2,
    youtubeVideoId: "GjdGqf_3oSs",
    thumbnailUrl: "https://img.youtube.com/vi/GjdGqf_3oSs/maxresdefault.jpg",
    altText: "Video Before After CPU",
    title: "What Is Digital Transformation?",
  },
  {
    id: 3,
    youtubeVideoId: "57co0E5YAuI",
    thumbnailUrl: "https://img.youtube.com/vi/57co0E5YAuI/maxresdefault.jpg",
    altText: "Video Before After CPU",
    title: "What Is ITOps?",
  },
];

function YoutubeSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(youtubeSlides.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentItems = youtubeSlides.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );
  return (
    <section className="bg-white rounded-lg p-6 border-1 border-gray-300">
      <h2 className="text-xl font-semibold text-blue-950 mb-6">Video Terbaru</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems.map((video) => (
          <YoutubePlayer
            key={video.id}
            youtubeVideoId={video.youtubeVideoId}
            thumbnailUrl={video.thumbnailUrl}
            altText={video.altText}
            title={video.title}
          />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-3 mt-6">
        <button onClick={prevSlide} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full ${i === currentSlide ? "bg-blue-950/90" : "bg-gray-300"
              } cursor-pointer`}
            ></button>
          ))}
        </div>

        <button onClick={nextSlide} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

export default YoutubeSection;