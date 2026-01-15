import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box, Typography, Button, TextField, Grid,
    Divider, Chip
} from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import GlassCard from "../../components/common/GlassCard";
import BookCard from "../../features/books/components/BookCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getToken } from "../../services/localStorageService";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton, Tooltip } from "@mui/material";
import { useToggleFavorite } from "../../features/favorites/hooks/useFavorites";

import { useToast } from "../../context/ToastContext";

export default function BookInfo() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [rentQuantity, setRentQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const { toggle } = useToggleFavorite();

    // Fetch Book
    // Fetch Book & Favorite Status
    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const token = getToken();
                const res = await axios.get(`http://localhost:8080/spring/books/${bookId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setBook(res.data?.status);

                if (token) {
                    try {
                        // Check if favorite
                        const favRes = await axios.get(`http://localhost:8080/spring/favorites/check/${bookId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setIsFavorite(favRes.data?.status);
                    } catch (ignore) { /* Ignore if check fails */ }
                }
            } catch (err) {
                console.error("Book fetch error:", err);
                navigate("/"); // Return home on error
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [bookId, navigate]);

    const handleToggleFavorite = async () => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }
        const success = await toggle(bookId);
        if (success) setIsFavorite(!isFavorite);
    };

    // Fetch Related
    useEffect(() => {
        if (!book?.category?.categoryId) return;
        const fetchRelated = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/spring/books/related/${book.category.categoryId}`,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                const all = res.data?.status || [];
                setRelatedBooks(all.filter(b => b.bookID !== book.bookID));
            } catch (e) { console.error(e) }
        }
        fetchRelated();
    }, [book]);

    const handleAddToCart = async () => {
        try {
            await axios.post(
                "http://localhost:8080/spring/cart/add",
                {
                    bookId: book.bookID,
                    quantity: rentQuantity
                },
                {
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );

            showToast(`Added "${book.title}" to cart!`, "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to add to cart. Please login.", "error");
        }
    };

    const handleRentNow = async () => {
        try {
            await axios.post(
                "http://localhost:8080/spring/cart/add",
                {
                    bookId: book.bookID,
                    quantity: rentQuantity
                },
                {
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );
            navigate("/cart");
        } catch (e) {
            console.error(e);
            showToast("Failed to rent.", "error");
        }
    };

    if (loading || !book) return <LoadingSpinner />;

    return (
        <MainLayout>
            <Grid container spacing={4} sx={{ mb: 6 }}>
                {/* Image Section */}
                <Grid item xs={12} md={4}>
                    <GlassCard sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                        {book.imageUrls?.[0] ? (
                            <Box
                                component="img"
                                src={book.imageUrls[0]}
                                sx={{
                                    maxWidth: "100%",
                                    maxHeight: 450,
                                    borderRadius: 2,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                                }}
                            />
                        ) : (
                            <Box sx={{ width: "100%", height: 300, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</Box>
                        )}
                    </GlassCard>
                </Grid>

                {/* Details Section */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start", mb: 2 }}>
                            Back
                        </Button>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h3" fontWeight={800} sx={{ color: "primary.main", mb: 1 }}>
                                {book.title}
                            </Typography>
                            <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                                <IconButton onClick={handleToggleFavorite} color="error" size="large">
                                    {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            by {book.author}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1, my: 2 }}>
                            <Chip label={book.categoryName || "Book"} color="primary" variant="outlined" />
                            <Chip label={book.availableCopies > 0 ? "In Stock" : "Out of Stock"} color={book.availableCopies > 0 ? "success" : "error"} />
                        </Box>

                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: "1.1rem", color: "text.primary" }}>
                            {book.description || "No description available for this book."}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                size="small"
                                inputProps={{ min: 1, max: book.availableCopies }}
                                value={rentQuantity}
                                onChange={(e) => setRentQuantity(Math.max(1, Math.min(book.availableCopies, Number(e.target.value))))}
                                sx={{ width: 100 }}
                            />

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                disabled={book.availableCopies === 0}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<RocketLaunchIcon />}
                                onClick={handleRentNow}
                                disabled={book.availableCopies === 0}
                            >
                                Rent Now
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {relatedBooks.length > 0 && (
                <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ borderLeft: "4px solid #ffca28", pl: 2 }}>
                        You might also like
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {relatedBooks.map((b) => (
                            <Grid item xs={6} sm={4} md={3} key={b.bookID}>
                                <BookCard book={b} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </MainLayout>
    );
}
