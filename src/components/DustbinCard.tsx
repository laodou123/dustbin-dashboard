import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DustbinCard.css";

interface DustbinCardProps {
  title: string;
  imageSrc: string;
}

const DustbinCard: React.FC<DustbinCardProps> = ({ title, imageSrc }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/details/${title.toLowerCase()}`);
  };

  return (
    <div
      className="dustbin-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img src={imageSrc} alt={title} className="dustbin-image" />
      <h3 className="dustbin-title">{title}</h3>
    </div>
  );
};

export default DustbinCard;
