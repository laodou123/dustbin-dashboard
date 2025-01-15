// src/components/DustbinHome.tsx

import React from "react";
import {
  Grid,
  Typography,
  Container,
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DustbinCard from "./DustbinCard";
import generalwasteImage from "../images/generalwaste.jpg";
import metalImage from "../images/metal.png";
import paperImage from "../images/paper.png";
import plasticImage from "../images/plastic.png";
import glassImage from "../images/glass.png"; // Newly imported glass image
import HomeIcon from "@mui/icons-material/Home";

const DustbinHome: React.FC = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const bins = [
    { title: "Plastic", imageSrc: plasticImage },
    { title: "Paper", imageSrc: paperImage },
    { title: "Metal", imageSrc: metalImage },
    { title: "General Waste", imageSrc: generalwasteImage },
    { title: "Glass", imageSrc: glassImage }, // Newly added glass bin
  ];

  return (
    <>
      <CssBaseline />

      {/* Main Container */}
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage: `url('https://source.unsplash.com/1600x900/?recycling')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: 200, sm: 300, md: 400 },
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginY: 4,
            position: "relative",
            color: "#fff",
            textAlign: "center",
            boxShadow: 3,
            paddingX: 2, // Added padding for better spacing on smaller screens
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay
              borderRadius: 2,
              zIndex: 1,
            },
            "& > *": {
              position: "relative",
              zIndex: 2,
            },
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Welcome to Smart Dustbins
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Monitor and manage your waste efficiently with real-time updates.
            </Typography>
          </Box>
        </Box>

        {/* Introduction Section */}
        <Box sx={{ marginY: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            My Devices
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ marginBottom: 4, color: "#666" }}
          >
            Select a bin to view its details and live updates.
          </Typography>
        </Box>

        {/* Grid Layout for Dustbin Cards */}
        <Grid container spacing={4}>
          {bins.map((bin, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DustbinCard title={bin.title} imageSrc={bin.imageSrc} />
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            marginY: 4,
            padding: 2,
            textAlign: "center",
            backgroundColor: theme.palette.grey[200],
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Smart Dustbins. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default DustbinHome;
