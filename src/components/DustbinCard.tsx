import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

interface DustbinCardProps {
  title: string;
  imageSrc: string;
}

const DustbinCard: React.FC<DustbinCardProps> = ({ title, imageSrc }) => {
  return (
    <Card
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={title}
          sx={{ height: 240, objectFit: "contain", backgroundColor: "#f5f5f5" }}
        />
        <CardContent>
          <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DustbinCard;
