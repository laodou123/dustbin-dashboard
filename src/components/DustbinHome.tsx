import React from "react";
import {
  Grid,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import testImage from "../images/test.jpeg";

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="hover:shadow-lg rounded-lg overflow-hidden"
    >
      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(238,238,238,1) 100%)",
        }}
      >
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            height="200"
            image={imageSrc}
            alt={`${title} image`}
            sx={{
              transition: "transform 0.5s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                marginTop: 1,
              }}
            >
              <Tooltip title="More Info" arrow>
                <FaInfoCircle size={22} color="#4caf50" />
              </Tooltip>
              <Tooltip title="Manage Bin" arrow>
                <IoTrashBin size={22} color="#ff5722" />
              </Tooltip>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

const DustbinHome: React.FC = () => {
  const bins = [
    { title: "Plastic", imageSrc: testImage },
    { title: "Paper", imageSrc: testImage },
    { title: "Metal", imageSrc: testImage },
    { title: "Children's", imageSrc: testImage },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ marginY: 5 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#4caf50",
            textShadow: "1px 1px 6px rgba(0,0,0,0.2)",
          }}
        >
          Smart Dustbins
          <h1 className="text-3xl font-bold text-center text-blue-500">
            Hello Tailwind CSS!
          </h1>
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            marginBottom: 4,
            color: "#666",
            fontSize: "1.1rem",
          }}
        >
          Explore your bins and manage their settings with ease.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {bins.map((bin, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DustbinCard title={bin.title} imageSrc={bin.imageSrc} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DustbinHome;
