function Footer() {
  const backgroundImageStyle = {
    backgroundImage: "url('/images/herohome.png')",
  };

  return (
    <footer className="relative text-white py-8 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={backgroundImageStyle} aria-hidden="true">
        <div className="absolute inset-0 bg-blue-950 opacity-85"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-1 hidden md:block">
          <h2 className="text-xl font-semibold mb-2">
            Corporate Technology Operation at Work
          </h2>
          <p className="text-sm leading-relaxed">
            Terima kasih atas dedikasi seluruh tim CTO dalam menjaga keberlangsungan
            operasional teknologi di lingkungan PT Finnet Indonesia. Kami di Corporate
            Technology Operation berkomitmen untuk menghadirkan infrastruktur IT yang
            andal, aman, dan efisien demi mendukung seluruh lini bisnis perusahaan.
            Temukan berbagai informasi seputar pengelolaan infrastruktur, pengembangan
            sistem, dukungan aplikasi, dan inovasi teknologi internal melalui website ini.
            Bersama, kita wujudkan Operasi Teknologi yang Tangguh dan Terintegrasi!
          </p>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/30 mt-6 pt-4 text-center text-xs opacity-90">
        © {new Date().getFullYear()} PT Finnet Indonesia - Corporate Technology Operation
      </div>
    </footer>
  );
}

export default Footer;