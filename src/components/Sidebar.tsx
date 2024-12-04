import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { Dashboard, Home, Settings, Campaign } from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Menu items with icons
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <Dashboard /> },
    { name: "DustbinHome", path: "/DustbinHome", icon: <Home /> },
    { name: "Marketing", path: "/marketing", icon: <Campaign /> },
    { name: "Settings", path: "/settings", icon: <Settings /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1a202c",
          color: "#fff",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          borderBottom: "1px solid #4a5568",
        }}
      >
        <Typography variant="h6" noWrap>
          SRB
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            sx={{
              backgroundColor:
                location.pathname === item.path ? "#2d3748" : "inherit",
              "&:hover": { backgroundColor: "#4a5568" },
            }}
          >
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
