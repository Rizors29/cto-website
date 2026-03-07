import { useEffect, useState } from "react";
import InventoryCard from "./InventoryCard";
import api from "../../utils/api";
import ENDPOINTS from "../../utils/endpoint";

function InventorySummary({ selectedYear }) {
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    expired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventorySummary = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(`${ENDPOINTS.INVENTORY}?year=${selectedYear}`);
        const list = response.data || [];

        const active = list.filter(r => r.sisa_masa_sewa !== "Expired").length;
        const expired = list.filter(r => r.sisa_masa_sewa === "Expired").length;
        const total = list.length;

        setSummary({
          total,
          active,
          expired
        });
      } catch (err) {
        console.error("InventorySummary error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventorySummary();
  }, [selectedYear]);


  const cardData = [
    { title: "Total Devices", value: summary.total, color: "bg-sky-600" },
    { title: "Active", value: summary.active, color: "bg-green-500" },
    { title: "Expired", value: summary.expired, color: "bg-red-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 rounded-lg bg-white sm:px-6 lg:px-8 border-1 border-gray-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-8">
        {cardData.map((item, index) => (
          <InventoryCard
            key={index}
            title={item.title}
            value={item.value}
            colorClass={item.color}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

export default InventorySummary;
