// File: BookListByCategory.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import useAuth from "../../features/auth/hooks/useAuth";
import MainLayout from "../../components/layout/MainLayout";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useToast } from "../../context/ToastContext";

function BookListByCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN");
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    totalCopies: 10,
    imageUrls: [],
    categoryId: categoryId,
  });

  const fetchBooks = useCallback(async () => {
    if (!categoryId) return;
    try {
      const res = await axios.get(`http://localhost:8080/spring/books/category/${categoryId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      setBooks(Array.isArray(res.data?.status) ? res.data.status : []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
    }
  }, [categoryId]);

  const fetchCategory = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/spring/categories/${categoryId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      // Depending on API, response might be res.data.status.name or something else
      // Adjusting based on CategoryList usage: getCategories returns list, need single category fetch or find from list
      // Assuming GET /categories/{id} exists or filtering list. 
      // Previous code used `http://localhost:8080/spring/category/${categoryId}` which might be wrong based on standard REST
      // Let's assume the previous code was correct about the endpoint or try to fetch from all categories if it fails.

      // Let's try standard REST pattern often used here
      if (res.data?.status?.name) {
        setCategoryName(res.data.status.name);
      } else {
        // Fallback: fetch all and find
        const allRes = await axios.get("http://localhost:8080/spring/categories");
        const found = allRes.data?.status?.find(c => c.categoryId === categoryId);
        if (found) setCategoryName(found.name);
      }

    } catch (err) {
      // Fallback if specific endpoint fails
      try {
        const allRes = await axios.get("http://localhost:8080/spring/categories");
        const found = allRes.data?.status?.find(c => c.categoryId === categoryId);
        if (found) setCategoryName(found.name);
      } catch (e) { console.error(e) }
    }
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) {
      navigate("/");
      return;
    }
    fetchBooks();
    fetchCategory();
  }, [categoryId, navigate, fetchBooks, fetchCategory]);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const res = await axios.delete(`http://localhost:8080/spring/books/${bookId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.data.code === 1000 || res.status === 200) {
        showToast("Book deleted", "success");
        fetchBooks();
      }
    } catch (err) {
      showToast("Failed to delete book", "error");
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      totalCopies: book.totalCopies || 10,
      imageUrls: book.imageUrls || [],
      categoryId: categoryId,
    });
    setEditingId(book.bookId);
    setIsEditing(true);
    setOpen(true);
  };

  const handleCreate = () => {
    setForm({ title: "", author: "", description: "", totalCopies: 10, imageUrls: [], categoryId: categoryId });
    setIsEditing(false);
    setOpen(true);
  }

  const handleSubmit = async () => {
    try {
      const method = isEditing ? "put" : "post";
      const url = isEditing
        ? `http://localhost:8080/spring/books/${editingId}`
        : "http://localhost:8080/spring/books";

      // Ensure array for images
      const mkPayload = {
        ...form,
        categoryId, // ensure categoryId is set
        imageUrls: Array.isArray(form.imageUrls) ? form.imageUrls : [form.imageUrls]
      };

      const res = await axios({
        method,
        url,
        data: mkPayload,
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (res.data?.code === 1000) {
        showToast(isEditing ? "Book updated" : "Book created", "success");
        setOpen(false);
        fetchBooks();
      } else {
        showToast(res.data.message || "Error", "error");
      }
    } catch (err) {
      showToast("Error saving book", "error");
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/categories")} sx={{ mb: 2 }}>
          Back to Categories
        </Button>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            {categoryName ? `${categoryName} Books` : 'Books'}
          </Typography>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Add Book
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.bookId || book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.imageUrls?.[0] || "https://via.placeholder.com/150"}
                  alt={book.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap title={book.title}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    Copies: {book.totalCopies}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} onClick={() => navigate(`/book/${book.bookId}`)}>
                    View
                  </Button>
                  {isAdmin && (
                    <Box sx={{ ml: "auto" }}>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(book.bookId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
          {books.length === 0 && (
            <Typography sx={{ p: 2, fontStyle: 'italic' }}>
              No books found in this category.
            </Typography>
          )}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
              <TextField label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} fullWidth />
              <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
              <TextField label="Copies" type="number" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) || 0 })} fullWidth />
              <TextField label="Image URL" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })} fullWidth helperText="Enter single image URL" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>{isEditing ? "Update" : "Create"}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

export default BookListByCategory;
