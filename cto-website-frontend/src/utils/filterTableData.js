import { dateFormatLong } from "./dateFormat";

const filterTableData = (data = [], searchTerm = "") => {
  if (!Array.isArray(data)) return [];

  if (!searchTerm.trim()) {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((row) => {
    return Object.entries(row).some(([key, value]) => {
      let valueToSearch = String(value ?? "");
      if (key.endsWith("_at") || key === "created_at") {
        valueToSearch = dateFormatLong(value);
      }

      return valueToSearch.toLowerCase().includes(lowerCaseSearchTerm);
    });
  });
};

export default filterTableData;
