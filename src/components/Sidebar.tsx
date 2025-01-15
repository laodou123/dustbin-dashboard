// src/components/Sidebar.tsx

import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaHome,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

// Define the width for expanded and collapsed states
const drawerWidthExpanded = 200;
const drawerWidthCollapsed = 60;

// Styled components using MUI's styled API
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: drawerWidthExpanded,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const SidebarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1200, // Ensure it stays above other elements
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close sidebar on clicking outside (for desktop hover)
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        if (!isSmDown && !isCollapsed) {
          setIsCollapsed(true);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed, isSmDown]);

  // Menu items with icons
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Dustbin Home", path: "/DustbinHome", icon: <FaHome /> },
    { name: "Settings", path: "/Setting", icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {isSmDown && (
        <IconButton
          onClick={toggleMobileSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300, // Above the drawer
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.grey[200],
            },
          }}
          aria-label="open sidebar"
        >
          <FaBars />
        </IconButton>
      )}

      <SidebarContainer ref={drawerRef}>
        {/* Permanent Drawer for Desktop */}
        {!isSmDown && (
          <StyledDrawer
            variant="permanent"
            open={!isCollapsed}
            PaperProps={{
              style: {
                width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
              },
            }}
          >
            <List>
              {/* Toggle Button */}
              <ListItem
                button
                onClick={toggleSidebar}
                sx={{
                  display: "flex",
                  justifyContent: isCollapsed ? "center" : "flex-end",
                  padding: theme.spacing(1, 2),
                }}
              >
                <ToggleButton aria-label="toggle sidebar">
                  {isCollapsed ? <FaBars /> : <FaTimes />}
                </ToggleButton>
              </ListItem>
              <Divider sx={{ backgroundColor: theme.palette.grey[700] }} />
              {/* Menu Items */}
              {menuItems.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.name}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Tooltip
                    title={isCollapsed ? item.name : ""}
                    placement="right"
                    arrow
                    disableHoverListener={!isCollapsed}
                  >
                    <ListItem button>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isCollapsed ? "auto" : 3,
                          justifyContent: "center",
                          color: theme.palette.common.white,
                          fontSize: "1.2rem",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && <ListItemText primary={item.name} />}
                    </ListItem>
                  </Tooltip>
                </NavLink>
              ))}
            </List>
          </StyledDrawer>
        )}

        {/* Temporary Drawer for Mobile */}
        {isSmDown && (
          <Drawer
            variant="temporary"
            open={isMobileOpen}
            onClose={toggleMobileSidebar}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidthExpanded,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
              },
            }}
          >
            <List>
              {/* Close Button */}
              <ListItem
                button
                onClick={toggleMobileSidebar}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: theme.spacing(1, 2),
                }}
              >
                <ToggleButton aria-label="close sidebar">
                  <FaTimes />
                </ToggleButton>
              </ListItem>
              <Divider sx={{ backgroundColor: theme.palette.grey[700] }} />
              {/* Menu Items */}
              {menuItems.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.name}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={toggleMobileSidebar} // Close sidebar on menu item click
                >
                  <ListItem button>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                        color: theme.palette.common.white,
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Drawer>
        )}
      </SidebarContainer>

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: !isSmDown
            ? isCollapsed
              ? `${drawerWidthCollapsed}px`
              : `${drawerWidthExpanded}px`
            : "0px",
          transition: "margin-left 0.3s ease",
          padding: theme.spacing(3),
          width: "100%",
        }}
      >
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;
