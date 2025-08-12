// File: Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";
import {
  Box, Card, CircularProgress, Typography, Grid,
  CardMedia, CardContent, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const getUserDetails = async (accessToken) => {
    const response = await fetch("http://localhost:8080/spring/users/myInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setUserDetails(data.status);
  };

  const fetchBooks = async () => {
    if (isSearching) return; // ưu tiên kết quả tìm kiếm
    try {
      const url = selectedCategory
        ? `http://localhost:8080/spring/books/category/${selectedCategory}`
        : "http://localhost:8080/spring/books";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      if (Array.isArray(data.status)) {
        setAllBooks(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/spring/category", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (Array.isArray(data.status)) {
        setCategories(data.status);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSearchResult = (books) => {
    setIsSearching(true);
    setAllBooks(books);
  };

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
    } else {
      getUserDetails(accessToken);
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory]);

  return (
    <>
      <Header onSearchResult={handleSearchResult} />
      <Box p={4} mt={8}>
        {userDetails ? (
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome back to library, {userDetails.username}!
            </Typography>

            <Box mt={3} mb={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Filter by Category"
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setIsSearching(false); // bỏ kết quả tìm kiếm nếu chọn danh mục
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" gutterBottom>
              📚 Danh sách sách
            </Typography>

            <Grid container spacing={2}>
              {allBooks.map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.bookId || book.bookID}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}
                   onClick={() => navigate(`/book-info/${book.bookID}`)}>
                    {book.imageUrls?.[0] && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={book.imageUrls[0]}
                        alt={book.title}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <CardContent>
                      <Typography fontWeight="bold">{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress />
            <Typography>Loading ...</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}