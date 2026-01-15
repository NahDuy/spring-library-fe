import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getToken } from '../../services/localStorageService';
import MainLayout from '../../components/layout/MainLayout';
import { useToast } from '../../context/ToastContext';

const AdminBookList = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        title: '', author: '', description: '', totalCopies: 10, imageUrls: [], categoryId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch("http://localhost:8080/spring/books");
            const data = await res.json();
            if (data.code === 1000) setBooks(data.status);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:8080/spring/categories");
            const data = await res.json();
            if (data.code === 1000) setCategories(data.status);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            const res = await fetch(`http://localhost:8080/spring/books/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                showToast("Book deleted", "success");
                fetchBooks();
            } else {
                showToast("Failed to delete", "error");
            }
        } catch (err) {
            showToast("Error deleting book", "error");
        }
    };

    const handleSubmit = async () => {
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing
            ? `http://localhost:8080/spring/books/${editingId}`
            : "http://localhost:8080/spring/books";

        // Ensure imageUrls is an array if strings
        const payload = {
            ...form,
            imageUrls: Array.isArray(form.imageUrls) ? form.imageUrls : [form.imageUrls]
        };

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.code === 1000) {
                showToast(isEditing ? "Book updated" : "Book created", "success");
                setOpen(false);
                fetchBooks();
            } else {
                showToast(data.message || "Operation failed", "error");
            }
        } catch (err) {
            showToast("Error saving book", "error");
        }
    };

    const handleEdit = (book) => {
        setForm({
            title: book.title,
            author: book.author,
            description: book.description,
            totalCopies: book.totalCopies,
            imageUrls: book.imageUrls || [],
            categoryId: book.categoryId || categories[0]?.categoryId || '' // Try to match if possible, or leave blank
        });
        setEditingId(book.bookId);
        setIsEditing(true);
        setOpen(true);
    };

    const handleCreate = () => {
        setForm({ title: '', author: '', description: '', totalCopies: 10, imageUrls: [], categoryId: '' });
        setIsEditing(false);
        setOpen(true);
    };

    return (
        <MainLayout>
            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h4" fontWeight="bold">Manage Books</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Add Book
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cover</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Copies</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.bookId}>
                                    <TableCell>
                                        <img src={book.imageUrls?.[0] || 'https://via.placeholder.com/50'} alt={book.title} width={50} height={75} style={{ objectFit: 'cover', borderRadius: 4 }} />
                                    </TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.totalCopies}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(book)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(book.bookId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>{isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
                            <TextField label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} fullWidth />
                            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
                            <TextField label="Total Copies" type="number" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: parseInt(e.target.value) })} fullWidth />
                            <TextField label="Image URL" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })} fullWidth helperText="Enter a single image URL" />

                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={form.categoryId}
                                    label="Category"
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
};

export default AdminBookList;
