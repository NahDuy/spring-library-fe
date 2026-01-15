import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FavoriteIcon from '@mui/icons-material/Favorite';

const FavoritesPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = getToken();
                if (!token) {
                    navigate("/login");
                    return;
                }
                const res = await axios.get("http://localhost:8080/spring/favorites", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.code === 1000) {
                    setBooks(res.data.status);
                }
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [navigate]);

    if (loading) return <LoadingSpinner />;

    return (
        <MainLayout>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon color="error" fontSize="large" />
                <Typography variant="h4" fontWeight="bold" color="primary">
                    My Favorite Books
                </Typography>
            </Box>

            {books.length === 0 ? (
                <Typography variant="h6" color="text.secondary" textAlign="center" mt={8}>
                    You haven't added any books to your favorites yet. ❤️
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.bookID}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}
                                onClick={() => navigate(`/books/${book.bookID}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="220"
                                    image={book.imageUrls?.[0] || "https://via.placeholder.com/150"}
                                    alt={book.title}
                                />
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap title={book.title}>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {book.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </MainLayout>
    );
};

export default FavoritesPage;
