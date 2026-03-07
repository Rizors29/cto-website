const dateFormatLong = (tanggal) => {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  if (isNaN(date.getTime())) {
    return "-"; 
  }

  const hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  const tgl = date.getDate();
  const bulan = date.toLocaleDateString("id-ID", { month: "long" });
  const tahun = date.getFullYear();

  return `${hari}, ${tgl} ${bulan} ${tahun}`;
};

const dateFormatShort = (tanggal) => {
  if (!tanggal) return "-";

  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return "-";

  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = today - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays} days ago`;

  const tgl = date.getDate();
  const bulan = date.toLocaleDateString("id-ID", { month: "short" });
  const tahun = date.getFullYear();

  return `${bulan} ${tgl}, ${tahun}`;
};

export { dateFormatLong, dateFormatShort };
