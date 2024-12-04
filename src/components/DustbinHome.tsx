import React from "react";
import {
  Grid,
  Typography,
  Container,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import DustbinCard from "./DustbinCard";
import testImage from "../images/test.jpeg";

const DustbinHome: React.FC = () => {
  const bins = [
    { title: "Plastic", imageSrc: testImage },
    { title: "Paper", imageSrc: testImage },
    { title: "Metal", imageSrc: testImage },
    { title: "Children's", imageSrc: testImage },
  ];

  return (
    <>
      {/* Main Container */}
      <Container>
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
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DustbinCard title={bin.title} imageSrc={bin.imageSrc} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default DustbinHome;
