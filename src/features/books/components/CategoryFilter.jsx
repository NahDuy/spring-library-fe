import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Explore Categories
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    overflowX: "auto",
                    pb: 1, // Padding for scrollbar
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 4 },
                }}
            >
                <Chip
                    label="All Books"
                    clickable
                    color={selectedCategory === "" ? "primary" : "default"}
                    variant={selectedCategory === "" ? "filled" : "outlined"}
                    onClick={() => onSelectCategory("")}
                    sx={{ fontWeight: 500 }}
                />
                {categories.map((cat) => (
                    <Chip
                        key={cat.categoryId}
                        label={cat.name}
                        clickable
                        color={selectedCategory === cat.categoryId ? "primary" : "default"}
                        variant={selectedCategory === cat.categoryId ? "filled" : "outlined"}
                        onClick={() => onSelectCategory(cat.categoryId)}
                        sx={{ fontWeight: 500 }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CategoryFilter;
