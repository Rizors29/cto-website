import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import api from "../../utils/api";

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function RequestChart({ selectedYear, setSelectedYear, monthEndpoint, categoryEndpoint }) {
  const currentYear = new Date().getFullYear();
  const [categoryData, setCategoryData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchAll = async () => {
      try {
        const [catRes, monthRes] = await Promise.all([
          api.get(categoryEndpoint),
          api.get(monthEndpoint),
        ]);

        if (!isMounted) return;

        const catData = catRes.data;
        const monthData = monthRes.data;

        setCategoryData({
          labels: catData.map((d) => d.jenis_kendala),
          datasets: [
            {
              data: catData.map((d) => d.total),
              backgroundColor: [
                "#4e79a7",
                "#f28e2b",
                "#e15759",
                "#76b7b2",
                "#59a14f",
                "#edc948",
              ],
            },
          ],
        });

        setMonthData({
          labels: monthData.map((d) => d.month),
          datasets: [
            {
              label: "Total Request",
              data: monthData.map((d) => d.total),
              backgroundColor: "#4e79a7",
            },
          ],
        });
      } catch (err) {
        console.error("RequestChart error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedYear, categoryEndpoint, monthEndpoint]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  
  const years = [];
  
  for (let y = 2025; y <= currentYear; y++) {
    years.push(y)
  }

  return (
    <div className="w-full max-w-7xl mx-auto my-8 p-6 rounded-lg bg-white border border-gray-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-950">
          IT Service Request Dashboard
        </h2>

        {setSelectedYear && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md font-semibold px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
          {isLoading ? (
            <div className="w-8 h-8 border-3 border-black/50 m-auto my-30 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <h3 className="text-lg text-center mb-4">Request Category</h3>
              <div className="h-[320px] flex items-center justify-center">
                {categoryData && (<Pie data={categoryData} options={chartOptions} />)}
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
          {isLoading ? (
            <div className="w-8 h-8 border-3 border-black/50 m-auto my-30 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <h3 className="text-lg text-center mb-4">Total Request per Month ({selectedYear})</h3>
              <div className="h-[320px]">
                {monthData && (<Bar data={monthData} options={chartOptions} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestChart;
