import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BookCard from './BookCard';

const PopularBookList = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/spring/books/popular?limit=6')
            .then(res => {
                if (res.data.code === 1000) {
                    setBooks(res.data.status);
                }
            })
            .catch(err => console.error("Error fetching popular books:", err));
    }, []);

    if (books.length === 0) return null;

    return (
        <Box sx={{ mb: 6 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <WhatshotIcon color="error" />
                <Typography variant="h5" fontWeight="bold">
                    Most Popular
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': { height: 8 },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#ddd', borderRadius: 4 }
            }}>
                {books.map(book => (
                    <Box key={book.bookID} sx={{ minWidth: 160, maxWidth: 160 }}>
                        <BookCard
                            book={book}
                            onClick={() => navigate(`/book-info/${book.bookID}`)}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PopularBookList;
