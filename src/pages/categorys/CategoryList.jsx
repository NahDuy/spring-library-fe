import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/api';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const res = await getCategories();
    if (res.data.code === 1000) {
      setCategories(res.data.status || []);
    } else {
      console.error('Lỗi khi lấy danh sách category:', res.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (form.categoryId) {
      await updateCategory(form.categoryId, form);
    } else {
      await createCategory(form);
    }
    setForm({ name: '', description: '' });
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm(cat);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  const handleViewBooks = (catId) => {
    if (!catId) return alert('Category ID is invalid!');
    navigate(`/books/${catId}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📚 Quản lý danh mục</h2>

        <div style={styles.formSection}>
          <input
            placeholder="Tên danh mục"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleSubmit} style={styles.createBtn}>
            {form.categoryId ? '📝 Cập nhật' : '➕ Tạo mới'}
          </button>
        </div>

        {categories.length > 0 ? (
          <ul style={styles.list}>
            {categories.map((cat) => (
              <li key={cat.categoryId} style={styles.card}>
                <h3 style={styles.cardTitle}>{cat.name}</h3>
                <p style={{ margin: '6px 0' }}>{cat.description}</p>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleViewBooks(cat.categoryId)} style={styles.btn}>📚 Sách</button>
                  <button onClick={() => handleEdit(cat)} style={styles.btn}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(cat.categoryId)} style={{ ...styles.btn, background: '#e74c3c' }}>
                    🗑️ Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}><i>Chưa có danh mục nào.</i></p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 40,
    background: '#f0f2f5',
  },
  container: {
    width: '100%',
    maxWidth: 600,
    background: 'white',
    borderRadius: 10,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c3e50',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 24,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  createBtn: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  card: {
    background: '#f9f9f9',
    border: '1px solid #ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    margin: 0,
    marginBottom: 6,
    color: '#2c3e50',
  },
  btnGroup: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#2ecc71',
    color: 'white',
    cursor: 'pointer',
  },
};
