import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function YoutubePlayer({ youtubeVideoId, thumbnailUrl, altText, title, hasBorder = true }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;

  const containerClass = hasBorder 
    ? "border border-gray-300 rounded-lg bg-white" 
    : "";

  if (isPlaying) {
    return (
      <div>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
        <p className="text-base font-medium text-blue-950 mt-2">{title}</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div 
        className={`aspect-video bg-black relative overflow-hidden group cursor-pointer ${hasBorder ? 'rounded-t-lg' : 'rounded-lg'}`} 
        onClick={handlePlay}
      >
        <img src={thumbnailUrl} alt={altText} className="w-full h-full object-cover transition-opacity group-hover:opacity-75"/>
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircleIcon className="w-20 h-20 text-white opacity-90" />
        </div>
      </div>
      {title && <p className="text-center font-medium text-blue-950 p-2">{title}</p>}
    </div>
  );
}

export default YoutubePlayer;