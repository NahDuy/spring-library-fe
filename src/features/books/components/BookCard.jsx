import React from "react";
import { CardContent, CardMedia, Typography, Box, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../../components/common/GlassCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BookCard = ({ book }) => {
    const navigate = useNavigate();

    return (
        <GlassCard
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                group: "true",
                cursor: "pointer",
                "&:hover .hover-overlay": {
                    opacity: 1,
                }
            }}
            onClick={() => navigate(`/book-info/${book.bookID || book.bookId}`)}
        >
            <Box sx={{ position: "relative", overflow: "hidden", pt: "140%" }}>
                {book.imageUrls?.[0] ? (
                    <CardMedia
                        component="img"
                        image={book.imageUrls[0]}
                        alt={book.title}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                            }
                        }}
                    />
                ) : (
                    <Box sx={{
                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                        bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Typography variant="caption">No Image</Typography>
                    </Box>
                )}

                {/* Overlay on Hover */}
                <Box
                    className="hover-overlay"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                    }}
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book-info/${book.bookID || book.bookId}`);
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                    title={book.title}
                    sx={{ fontWeight: 700, fontSize: "1rem" }}
                >
                    {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    {book.author}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                        label={book.categoryName || "Book"}
                        size="small"
                        sx={{ bgcolor: "primary.light", color: "white", fontSize: "0.7rem" }}
                    />
                    <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                        Available
                    </Typography>
                </Box>
            </CardContent>
        </GlassCard>
    );
};

export default BookCard;
