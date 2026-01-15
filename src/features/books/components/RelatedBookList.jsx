import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const RelatedBookList = ({ bookId }) => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!bookId) return;
        axios.get(`http://localhost:8080/spring/books/suggestions/${bookId}`)
            .then(res => {
                if (res.data.code === 1000) {
                    setBooks(res.data.status);
                }
            })
            .catch(err => console.error("Error fetching related books:", err));
    }, [bookId]);

    if (books.length === 0) return null;

    return (
        <Box sx={{ mt: 6 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <AutoStoriesIcon color="primary" />
                <Typography variant="h5" fontWeight="bold">
                    You Might Also Like
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {books.map(book => (
                    <Grid item xs={6} sm={4} md={2.4} key={book.bookID}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: '0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                            }}
                            onClick={() => {
                                navigate(`/books/${book.bookID}`);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.imageUrls?.[0] || "https://via.placeholder.com/150"}
                                alt={book.title}
                            />
                            <CardContent sx={{ p: 1.5 }}>
                                <Typography variant="subtitle2" noWrap fontWeight="bold" title={book.title}>
                                    {book.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap display="block">
                                    {book.author}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default RelatedBookList;
