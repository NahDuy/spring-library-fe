import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import BookCard from "./BookCard";
import { keyframes } from "@emotion/react";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BookGrid = ({ books }) => {
    if (!books || books.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 8, opacity: 0.7 }}>
                <Typography variant="h6">No books found.</Typography>
                <Typography variant="body2">Try selecting a different category.</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {books.map((book, index) => (
                <Grid
                    item xs={12} sm={6} md={4} lg={3}
                    key={book.bookID || book.bookId}
                    sx={{
                        animation: `${fadeInUp} 0.5s ease-out both`,
                        animationDelay: `${index * 0.05}s` // Staggered animation
                    }}
                >
                    <BookCard
                        book={book}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default BookGrid;
