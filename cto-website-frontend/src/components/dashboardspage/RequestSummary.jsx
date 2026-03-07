import { useEffect, useState } from "react";
import RequestCard from "./RequestCard";
import api from "../../utils/api";

function RequestSummary({ selectedYear, endpoint }) {
  const [summary, setSummary] = useState({
    total: 0,
    newStatus: 0,
    inProgress: 0,
    done: 0,
    rejected: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequestSummary = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(endpoint);
        const data = response.data || {};

        setSummary({
          total: data.total || 0,
          newStatus: data.newStatus || 0,
          inProgress: data.inProgress || 0,
          done: data.done || 0,
          rejected: data.rejected || 0,
        });
      } catch (err) {
        console.error("RequestSummary error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestSummary();
  }, [selectedYear, endpoint]);

  const cardData = [
    { title: "Total Request", value: summary.total, color: "bg-sky-600" },
    { title: "New", value: summary.newStatus, color: "bg-sky-400" },
    { title: "In Progress", value: summary.inProgress, color: "bg-yellow-400" },
    { title: "Done", value: summary.done, color: "bg-green-500" },
    { title: "Rejected", value: summary.rejected, color: "bg-red-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 bg-white rounded-lg sm:px-6 lg:px-8 border border-gray-300">
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 py-8"
      >
        {cardData.map((item, index) => (
          <RequestCard
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

export default RequestSummary;
