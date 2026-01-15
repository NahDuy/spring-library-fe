// src/pages/home/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getToken } from "../../services/localStorageService";

// Layout & Components
import MainLayout from "../../components/layout/MainLayout";
import BookGrid from "../../features/books/components/BookGrid";
import CategoryFilter from "../../features/books/components/CategoryFilter";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PopularBookList from "../../features/books/components/PopularBookList";

// Hooks
import useBooks from "../../features/books/hooks/useBooks";
import useAuth from "../../features/auth/hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");

  // Custom Hooks for Logic
  const { books, categories, loading: booksLoading, setBooks } = useBooks(selectedCategory);
  const { user, loading: authLoading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSearchResult = (results) => {
    setBooks(results);
  };

  if (authLoading || booksLoading) {
    return <LoadingSpinner message="Loading your library..." />;
  }

  return (
    <MainLayout onSearchResult={handleSearchResult}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
          Welcome back, {user?.username || "Reader"}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover your next favorite book from our collection.
        </Typography>
      </Box>

      <PopularBookList />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <BookGrid books={books} />
    </MainLayout>
  );
}