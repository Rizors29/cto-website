import React from "react";
import RequestTable from "../components/dashboardspage/RequestTable";
import ENDPOINTS from "../utils/endpoint";

class RequestOperation extends React.Component {
  render() {
    return (
      <RequestTable role="admin" mode="operation" endpoint={ENDPOINTS.REQUEST} />
    );
  }
}

export default RequestOperation;