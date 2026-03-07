function GuideItem({ icon: Icon, text, url }) {
  return (
    <div className="flex-1">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-700 hover:font-semibold cursor-pointer py-1"
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{text}</span>
      </a>
    </div>
  );
}

export default GuideItem;
