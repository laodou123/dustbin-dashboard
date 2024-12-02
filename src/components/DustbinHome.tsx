import React from "react";
import "../styles/DustbinHome.css";
import DustbinCard from "./DustbinCard";
import testImage from "../images/test.jpeg";

const DustbinHome: React.FC = () => {
  const bins = [
    { title: "Plastic", imageSrc: testImage },
    { title: "Paper", imageSrc: testImage },
    { title: "Metal", imageSrc: testImage },
    { title: "Children's", imageSrc: testImage },
    { title: "Children's", imageSrc: testImage },
  ];

  return (
    <div className="dustbin-home">
      <h2>My Devices</h2>
      <div className="dustbin-grid">
        {bins.map((bin, index) => (
          <DustbinCard key={index} title={bin.title} imageSrc={bin.imageSrc} />
        ))}
      </div>
    </div>
  );
};

export default DustbinHome;
