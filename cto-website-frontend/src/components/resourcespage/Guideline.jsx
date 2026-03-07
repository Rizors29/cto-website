import { Link } from "react-router-dom";

function Guideline() {
  const guidelines = [
    {
      id: 1,
      title: "Tutorial Install Printer",
      thumbnail: "/images/panduan1.png",
      link: "/Tutorial-Install-Printer-Driver.pdf"
    },
    {
      id: 2,
      title: "Tutorial Install Windows 11",
      thumbnail: "/images/panduan2.png",
      link: "/Tutorial-Install-Windows-11.pdf"
    },
    {
      id: 3,
      title: "Tutorial Registrasi Microsoft 365",
      thumbnail: "/images/panduan3.png",
      link: "/Tutorial-Registrasi-Microsoft-365.pdf"
    },
  ];

  return (
    <section>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg border border-gray-300">
        <div className="flex justify-between items-center mb-6 text-blue-950">
          <h2 className="text-2xl font-semibold">Panduan Terbaru</h2>
          <Link to="/document-library" className="space-x-1 p-2 rounded-md font-medium hover:bg-gray-100 cursor-pointer">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidelines.map((item) => (
            <a 
              key={item.id} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block no-underline"
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transform transition duration-300">
                <div className="p-2 bg-white border-b-2 border-red-500">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-40 object-contain bg-gray-100 rounded"
                  />
                </div>

                <div className="p-4">
                  <p className="text-blue-950/90 font-semibold mb-1 tracking-wider">Panduan {item.id}</p>
                  <h3 className="text-blue-950/70 font-semibold text-sm line-clamp-2 mb-2 h-10">
                    {item.title}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Guideline;