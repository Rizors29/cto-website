import React from "react";
import Guideline from "../components/resourcespage/Guideline";
import Policy from "../components/resourcespage/Policy";

class GuidelinePolicy extends React.Component {
  render() {
    return (
      <>
        <Guideline />
        <Policy />
      </>
    );
  }
}

export default GuidelinePolicy;