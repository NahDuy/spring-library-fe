import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/HomeRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import FavoriteIcon from '@mui/icons-material/FavoriteRounded';

import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../services/localStorageService";
import NotificationBell from "../notification/NotificationBell";
import useAuth from "../../features/auth/hooks/useAuth";

// Styled Components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 30, // Pill shape
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: "all 0.3s ease",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch", // Expand on focus
      }
    },
  },
}));

const Header = ({ onSearchResult, cartCount = 0 }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    handleMenuClose();
  };

  const handleSearch = async (query) => {
    // Logic from previous header
    if (!query.trim()) return;
    try {
      const res = await fetch(`http://localhost:8080/spring/books/search?query=${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (onSearchResult && Array.isArray(data.status)) {
        onSearchResult(data.status);
      }
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN");

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Brand */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <Box
            component="img"
            src="https://img.icons8.com/fluency/48/library.png"
            alt="Library"
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(45deg, #1a237e, #534bae)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Spring Library
          </Typography>
        </Box>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Home">
            <IconButton color="primary" onClick={() => navigate("/")}>
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {!isAdmin && (
            <>
              <Tooltip title="Favorites">
                <IconButton color="primary" onClick={() => navigate("/favorites")}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton color="primary" onClick={() => navigate("/cart")}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="My Loans">
                <IconButton color="primary" onClick={() => navigate("/confirmed-loans")}>
                  <AssignmentTurnedInIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {!isAdmin && (
            <Tooltip title="My Fines">
              <IconButton color="inherit" onClick={() => navigate("/my-fines")}>
                <MonetizationOnIcon />
              </IconButton>
            </Tooltip>
          )}

          {isAdmin && (
            <>
              <Tooltip title="Admin Loans">
                <IconButton color="primary" onClick={() => navigate("/admin/loans")}>
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Admin Fines">
                <IconButton color="primary" onClick={() => navigate("/admin/fines")}>
                  <MonetizationOnIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Manage Categories">
                <IconButton color="primary" onClick={() => navigate("/categories")}>
                  <CategoryRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Notification */}
          <NotificationBell />

          {/* User Profile */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              ml: 1,
              border: "2px solid #fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => navigate("/profile")}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
