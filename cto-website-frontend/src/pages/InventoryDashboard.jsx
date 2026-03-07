import React from "react";
import InventoryChart from "../components/dashboardspage/InventoryChart";
import InventoryTable from "../components/dashboardspage/InventoryTable";
import InventorySummary from "../components/dashboardspage/InventorySummary";
import ENDPOINTS from "../utils/endpoint";

class InventoryDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2024,
    };
  }

  setSelectedYear = (year) => {
    this.setState({ selectedYear: year });
  };

  render() {
    const { selectedYear } = this.state;
    
    return (
      <>
        <InventorySummary selectedYear={selectedYear} />

        <InventoryChart
          selectedYear={selectedYear}
          setSelectedYear={this.setSelectedYear}
          monthEndpoint={ENDPOINTS.INVENTORY_MONTH(selectedYear)}
          categoryEndpoint={ENDPOINTS.INVENTORY_CATEGORY(selectedYear)}
        />

        <InventoryTable year={selectedYear} mode="dashboard" />
      </>
    );
  }
}

export default InventoryDashboard;