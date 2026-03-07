function OurPartner() {
  const partners = [
    { name: "Tableau", logo: "images/tableau.png" },
    { name: "Pentaho", logo: "images/pentaho.png" },
    { name: "Finpay", logo: "images/finpay.png" },
    { name: "Thinkpad", logo: "images/thinkpad.png" },
    { name: "HP", logo: "images/hp.png" },
    { name: "Microsoft 365", logo: "images/ms365.png" },
  ];

  return (
    <section>
      <div className="items-center bg-white rounded-lg border border-gray-300 text-blue-950">
        <h2 className="text-lg font-semibold px-6 py-4 border-b border-gray-200">Our Partners</h2>
        <div className="flex flex-wrap justify-between items-center gap-6 px-4 pb-4">
          {partners.map((partner, index) => (
            <div key={index} className="flex-1 flex justify-center min-w-[100px] pt-5 hover:scale-[1.05] transition">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-20 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurPartner;