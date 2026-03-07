function SidebarButton({ icon: Icon, text }) {
  return (
    <button className="border-1 border-gray-300 text-blue-950 bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center min-w-full h-24 hover:bg-blue-950 hover:text-white transition-all cursor-pointer">
      <Icon className="w-8 h-8" />
      <span className="mt-2 text-xs font-semibold">{text}</span>
    </button>
  );
}

export default SidebarButton;

