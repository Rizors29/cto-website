import { useState, useEffect, useCallback } from 'react';
const slides = [
  {
    id: 0,
    src: "/images/carousel1.svg",
    alt: "Gambar Latar Belakang Teknologi",
    title: "Solusi IT Cepat dan Andal",
    subtitle: "Laporkan kendala IT Anda sekarang, kami siap membantu 24/7.",
  },
  {
    id: 1,
    src: "/images/carousel2.svg",
    alt: "Dashboard manajemen perangkat",
    title: "Kelola Semua Perangkat Anda",
    subtitle: "Temukan spesifikasi, panduan, dan informasi perangkat IT perusahaan.",
  },
  {
    id: 2,
    src: "/images/carousel3.svg",
    alt: "Dashboard monitoring real-time",
    title: "Status Perangkat Real-Time",
    subtitle: "Pantau kinerja dan daftar penerima perangkat Seat Management Anda.",
  },
  {
    id: 3,
    src: "/images/carousel4.svg",
    alt: "Tumpukan buku dan panduan digital",
    title: "Akses Mudah ke Sumber Daya",
    subtitle: "Panduan, FAQ, dan best practice untuk teknologi yang lebih baik.",
  },
  {
    id: 4,
    src: "/images/carousel5.svg",
    alt: "Tim bekerja di kantor modern",
    title: "Transformasi Digital Dimulai di sini",
    subtitle: "CTO, Mitra tepercaya Anda dalam inovasi dan stabilitas teknologi.",
  },
];

function HeroHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div id="default-carousel" className="w-full relative" data-carousel="slide">
      <div className="h-96 overflow-hidden md:h-[70vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="block w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
              <h1 className="text-xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-2">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-xl md:text-2xl text-white text-center font-normal max-w-3xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute z-10 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 cursor-pointer rounded-full transition-colors ${index === activeIndex ? 'bg-blue-950 dark:bg-blue-500' : 'bg-white/50 hover:bg-white border-1 border-gray-800/50 dark:bg-gray-600 dark:hover:bg-gray-400'}`}
            aria-current={index === activeIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <button
        type="button"
        className="absolute hidden md:block top-0 start-0 z-10 flex items-center justify-center h-full px-4 group focus:outline-none cursor-pointer"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute hidden md:block top-0 end-0 z-10 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>

  );
}

export default HeroHome;