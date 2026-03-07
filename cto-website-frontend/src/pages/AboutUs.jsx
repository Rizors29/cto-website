import React from "react";
import HeroAbout from "../components/aboutpage/HeroAbout";
import OurTeam from "../components/aboutpage/OurTeam";

class AboutUs extends React.Component {
  render() {
    return (
      <>
        <HeroAbout />
        <OurTeam />
      </>
    );
  }
}

export default AboutUs;