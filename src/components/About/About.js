import React from "react";
import bg2 from "../../assets/svg (4).png";
import "./aboutStyle.css";
import krishn from "../../assets/krishn.jfif";
import shub from "../../assets/shubham.jfif";
import sid from "../../assets/sidhdharth.jfif";
import SocialMedia from "./SocialMedia";

const About = () => {
  return (
    <div className="about-container">
      <img src={bg2} alt="" className="bg2" />
      <div className="members">
        <img src={sid} alt="" />
        <div style={{color: "#5E17EB", fontSize: "1.5rem", fontWeight:"600", textTransform:"uppercase", marginTop: "-20px"}}>Sidhdharth Shukla</div>
        <SocialMedia
          name="Sidhdharth Shukla"
          github="https://github.com/gunner26735"
          linkedin="https://www.linkedin.com/in/siddharth-shukla-9b4448205/"
          twitter="https://twitter.com/Sid26735"
        />
      </div>
      <div className="members">
        <img src={shub} alt="" />
        <div style={{color: "#5E17EB", fontSize: "1.5rem", textTransform:"uppercase", marginTop: "-20px"}}>Shubham Patel</div>
        <SocialMedia
          name="Shubham Patel"
          github="https://github.com/shxb7"
          linkedin="https://www.linkedin.com/in/devshub21/"
          twitter="https://twitter.com/shxb7_"
        />
      </div>
      <div className="members">
        <img src={krishn} alt="" />
        <div style={{color: "#5E17EB", fontSize: "1.5rem", textTransform:"uppercase", marginTop: "-20px"}}>Krishn Panchal</div>
        <SocialMedia
          name="Krishn Panchal"
          github="https://github.com/phovious-14"
          linkedin="https://www.linkedin.com/in/krishn-panchal-665388201/"
          twitter="https://twitter.com/krishnpanchal14"
        />
      </div>
    </div>
  );
};

export default About;
