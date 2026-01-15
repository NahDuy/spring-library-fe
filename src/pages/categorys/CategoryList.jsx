import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api';
import useAuth from '../../features/auth/hooks/useAuth';
import MainLayout from '../../components/layout/MainLayout';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useToast } from '../../context/ToastContext';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ADMIN");
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data.code === 1000) {
        setCategories(res.data.status || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      if (form.categoryId) {
        await updateCategory(form.categoryId, form);
        showToast('Category updated', 'success');
      } else {
        await createCategory(form);
        showToast('Category created', 'success');
      }
      setForm({ name: '', description: '' });
      setOpen(false);
      fetchCategories();
    } catch (error) {
      showToast('Error saving category', 'error');
    }
  };

  const handleCreate = () => {
    setForm({ name: '', description: '' });
    setIsEditing(false);
    setOpen(true);
  }

  const handleEdit = (cat) => {
    setForm(cat);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      showToast('Category deleted', 'success');
      fetchCategories();
    } catch (error) {
      showToast('Error deleting category', 'error');
    }
  };

  const handleViewBooks = (catId) => {
    navigate(`/books/${catId}`);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            📚 Categories
          </Typography>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
              Add Category
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.categoryId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {cat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<MenuBookIcon />} onClick={() => handleViewBooks(cat.categoryId)}>
                    View Books
                  </Button>
                  {isAdmin && (
                    <Box sx={{ ml: 'auto' }}>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(cat)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(cat.categoryId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
          {categories.length === 0 && (
            <Typography sx={{ p: 2, fontStyle: 'italic', color: 'text.secondary' }}>
              No categories found.
            </Typography>
          )}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}
