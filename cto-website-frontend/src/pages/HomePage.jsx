import React from "react";
import HeroHome from "../components/homepage/HeroHome";
import ContentHome from "../components/homepage/ContentHome";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <HeroHome />
        <ContentHome />
      </>
    );
  }
}

export default HomePage;