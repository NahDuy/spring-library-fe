// src/components/header/Header.jsx
import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  AppBar, Box, Toolbar, IconButton, Typography, InputBase,
  Menu, MenuItem, Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../services/localStorageService";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

export default function Header({ onSearchResult, cartCount = 0 }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    handleMenuClose();
  };

  const handleGoToProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleNavigateFines = () => {
    navigate("/fines");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      try {
        const res = await fetch(`http://localhost:8080/spring/books/search?query=${searchQuery}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (onSearchResult && Array.isArray(data.status)) {
          onSearchResult(data.status);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      }
    }
  };

  const handleOpenLoans = () => {
    navigate("/confirmed-loans");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={async () => {
              navigate("/");
              setSearchQuery("");
              try {
                const res = await fetch("http://localhost:8080/spring/books", {
                  headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                if (onSearchResult && Array.isArray(data.status)) {
                  onSearchResult(data.status);
                }
              } catch (err) {
                console.error("Lỗi khi load toàn bộ sách:", err);
              }
            }}
          >
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            Library App
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Search>

          {/* Giỏ hàng */}
          <Box sx={{ ml: 2, position: "relative" }}>
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <ShoppingCartIcon />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                >
                  {cartCount}
                </span>
              )}
            </IconButton>
          </Box>

          {/* Icon tiền phạt */}
          <IconButton color="inherit" onClick={handleNavigateFines}>
            <MonetizationOnIcon />
          </IconButton>

          {/* Đơn mượn confirmed */}
          <Box sx={{ ml: 2 }}>
            <IconButton color="inherit" onClick={handleOpenLoans}>
              <AssignmentTurnedInIcon />
            </IconButton>
          </Box>

          {/* Avatar menu */}
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  "&:before": {
                    content: '""',
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
              <MenuItem onClick={handleGoToProfile}>👤 Hồ sơ</MenuItem>
              <MenuItem onClick={handleLogout}>🚪 Đăng xuất</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
