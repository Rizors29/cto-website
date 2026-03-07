import React from "react";
import RequestChart from "../components/dashboardspage/RequestChart";
import RequestTable from "../components/dashboardspage/RequestTable";
import RequestSummary from "../components/dashboardspage/RequestSummary";

import ENDPOINTS from "../utils/endpoint";

class RequestDashboardAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: new Date().getFullYear(),
    };
  }

  setSelectedYear = (year) => {
    this.setState({ selectedYear: year });
  };

  render() {
    const { selectedYear } = this.state;

    return (
      <>
        <RequestSummary
          selectedYear={selectedYear}
          endpoint={ENDPOINTS.REQUEST_SUMMARY_ADMIN(selectedYear)}
        />

        <RequestChart
          selectedYear={selectedYear}
          setSelectedYear={this.setSelectedYear}
          monthEndpoint={ENDPOINTS.REQUEST_MONTH_ADMIN(selectedYear)}
          categoryEndpoint={ENDPOINTS.REQUEST_CATEGORY_ADMIN(selectedYear)}
        />

        <RequestTable
          role="admin"
          mode="dashboard"
          endpoint={ENDPOINTS.REQUEST_TABLE_ADMIN(selectedYear)}
        />
      </>
    );
  }
}

export default RequestDashboardAdmin;
