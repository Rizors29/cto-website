const sortByString = (data, key, order = "asc") => {
  if (!Array.isArray(data)) return [];

  return [...data].sort((a, b) => {
    const valA = (a[key] || "").toString().toLowerCase();
    const valB = (b[key] || "").toString().toLowerCase();

    if (order === "asc") return valA.localeCompare(valB);
    if (order === "desc") return valB.localeCompare(valA);
    return 0;
  });
};

const sortByDate = (data, key, order = "desc") => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

const sortByNumber = (data, key, order = "asc") => {
  return [...data].sort((a, b) => {
    return order === "asc"
      ? a[key] - b[key]
      : b[key] - a[key];
  });
};

export { sortByString, sortByDate, sortByNumber };