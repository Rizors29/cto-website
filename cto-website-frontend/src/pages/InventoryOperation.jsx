import React from "react";
import InventoryTable from "../components/dashboardspage/InventoryTable";

class InventoryOperation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2024,
    };
  }

  render() {
    const { selectedYear } = this.state;
    
    return (
      <InventoryTable year={selectedYear} mode="operation" />
    );
  }
}

export default InventoryOperation;