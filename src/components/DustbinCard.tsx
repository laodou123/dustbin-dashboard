// DustbinCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

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
        borderRadius: 3,
        boxShadow: 4,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{ flexGrow: 1 }}
        aria-label={`View details for ${title} bin`}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={imageSrc}
            alt={`${title} dustbin`}
            sx={{
              objectFit: "cover",
              filter: "brightness(0.7)",
              transition: "filter 0.3s",
              "&:hover": {
                filter: "brightness(0.5)",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: 2,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ marginTop: 1 }}
          >
            Click to view live updates and details about your{" "}
            {title.toLowerCase()} bin.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

DustbinCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
};

export default DustbinCard;
