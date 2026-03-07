import YoutubePlayer from "../homepage/YoutubePlayer";

function HeroAbout() {
  return (
    <section className="w-full bg-blue-950/90 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8 py-16">
        <YoutubePlayer
          hasBorder={false}
          youtubeVideoId="Jao35mxY0Ew"
          thumbnailUrl="https://img.youtube.com/vi/Jao35mxY0Ew/maxresdefault.jpg"
          altText="Video What is SharePoint"
        />
        <div>
          <h1 className="text-2xl font-semibold mb-4 sm:text-3xl">Welcome to CTO Website!</h1>
          <p>
            Corporate Technology Operation (CTO) hadir sebagai pusat pengelolaan dan pengembangan teknologi
            di lingkungan perusahaan. Kami berfokus pada peningkatan efisiensi, keamanan, dan inovasi digital
            untuk mendukung tercapainya transformasi teknologi yang berkelanjutan di Finnet Indonesia.
          </p>
          <a href="#" className="mt-8 inline-block font-semibold text-lg hover:underline">
            Lanjut ke portal pusat pembelajaran &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroAbout;