import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import Header from "../header/Header";

const MainLayout = ({ children, onSearchResult, cartCount }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <CssBaseline />
            <Header onSearchResult={onSearchResult} cartCount={cartCount} />

            {/* Content Area - Added padding top to account for fixed Header */}
            <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 4, mt: 8 }}>
                {children}
            </Container>

            {/* Optional Footer can go here */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: "auto",
                    textAlign: "center",
                    bgcolor: "background.paper", // Cleaner look
                    color: "text.secondary",
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
                }}
            >
                <span style={{ fontWeight: 500 }}>Spring Library</span> © {new Date().getFullYear()} - Designed for Excellence
            </Box>
        </Box>
    );
};

export default MainLayout;
