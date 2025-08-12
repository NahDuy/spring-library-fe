// File: BookListByCategory.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

function BookListByCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    totalCopies: "",
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

  useEffect(() => {
    if (!categoryId) return;
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (!categoryId) {
      navigate("/");
      return;
    }
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/spring/category/${categoryId}`,
          { headers: { Authorization: `Bearer ${getToken()}` } });
        setCategoryName(res.data?.status?.name || "");
      } catch (err) {
        console.error("Failed to fetch category:", err);
      }
    };
    fetchCategory();
  }, [categoryId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;
    try {
      await axios.delete(`http://localhost:8080/spring/books/${bookId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchBooks();
    } catch (err) {
      console.error("Lỗi khi xóa sách:", err);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      totalCopies: book.totalCopies?.toString() || "",
      imageUrls: book.imageUrls || [],
      categoryId: book.category?.categoryId || categoryId,
    });
    setSelectedFiles([]);
  };

  const handleSubmit = async () => {
    try {
      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      }

      const payload = {
        ...form,
        imageUrls: uploadedUrls,
      };

      const res = await axios.post("http://localhost:8080/spring/books", payload,
        { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.data?.code === 1000) {
        setForm({
          title: "",
          author: "",
          description: "",
          totalCopies: "",
          imageUrls: [],
          categoryId: categoryId,
        });
        setSelectedFiles([]);
        fetchBooks();
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📚 Sách thuộc danh mục: {categoryName}</h2>
        <button onClick={() => navigate("/categories")} style={styles.backBtn}>⬅️ Quay lại danh mục</button>

        <div style={styles.formSection}>
          <input name="title" placeholder="Tiêu đề" value={form.title || ""} onChange={handleChange} style={styles.input} />
          <input name="author" placeholder="Tác giả" value={form.author || ""} onChange={handleChange} style={styles.input} />
          <input name="totalCopies" placeholder="Số lượng" value={form.totalCopies || ""} onChange={handleChange} style={styles.input} />
          <input name="description" placeholder="Mô tả" value={form.description || ""} onChange={handleChange} style={styles.input} />
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ marginTop: 8 }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {selectedFiles.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt={`preview ${idx}`} width={80} style={{ borderRadius: 4 }} />
            ))}
          </div>
          <button onClick={handleSubmit} style={styles.submitBtn}>➕ Thêm sách</button>
        </div>

        {books.length > 0 ? (
          <ul style={styles.list}>
            {books.map((book) => {
              const bookId = book.bookId || book.bookID;
              return (
                <li key={bookId} style={styles.card}>
                  <strong>{book.title}</strong> - {book.author}
                  <div style={styles.cardButtons}>
                    <button onClick={() => navigate(`/book/${bookId}`)} style={styles.btn}>📖 Xem</button>
                    <button onClick={() => handleEdit(book)} style={styles.btn}>✏️ Sửa</button>
                    <button onClick={() => handleDelete(bookId)} style={{ ...styles.btn, backgroundColor: '#e74c3c' }}>🗑️ Xóa</button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ textAlign: 'center' }}><i>Không có sách trong danh mục này.</i></p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
    padding: '40px 0',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 700,
    background: 'white',
    padding: 24,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  backBtn: {
    marginBottom: 20,
    padding: '8px 12px',
    backgroundColor: '#bdc3c7',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 30,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  submitBtn: {
    padding: 10,
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 10,
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  card: {
    border: '1px solid #ddd',
    background: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardButtons: {
    marginTop: 10,
    display: 'flex',
    gap: 10,
  },
  btn: {
    padding: 8,
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#2ecc71',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
  },
};

export default BookListByCategory;
