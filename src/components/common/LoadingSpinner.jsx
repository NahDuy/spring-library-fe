import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
                gap: 2,
            }}
        >
            <CircularProgress size={60} thickness={4} color="primary" />
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;
