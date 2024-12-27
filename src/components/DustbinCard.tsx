import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";

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
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: 4,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="180"
          image={imageSrc}
          alt={`${title} image`}
          sx={{
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DustbinCard;
