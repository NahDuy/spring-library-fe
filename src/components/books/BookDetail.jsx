import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/spring/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        setBook(res.data?.status);
      } catch (err) {
        console.error("Không lấy được chi tiết sách:", err);
        navigate("/");
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  if (!book) return <p style={{ textAlign: "center", marginTop: 50 }}>Đang tải thông tin sách...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>📖 {book.title}</h2>

        <p><strong>Tác giả:</strong> {book.author}</p>
        <p><strong>Mô tả:</strong> {book.description}</p>
        <p><strong>Tổng số:</strong> {book.totalCopies}</p>
        <p><strong>Hiện còn:</strong> {book.availableCopies}</p>
        {book.category && <p><strong>Danh mục:</strong> {book.category.name}</p>}

        {Array.isArray(book.imageUrls) && book.imageUrls.length > 0 && (
          <div style={styles.imageWrapper}>
            <h4>Ảnh sách:</h4>
            <div style={styles.imageGrid}>
              {book.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`book-image-${idx}`}
                  width={150}
                  style={styles.image}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))}
            </div>
          </div>
        )}

        <button onClick={() => navigate(-1)} style={styles.backBtn}>⬅️ Quay lại</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
    padding: 24,
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: 600,
    width: "100%",
  },
  title: {
    marginBottom: 20,
    color: "#2c3e50",
  },
  imageWrapper: {
    marginTop: 20,
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  image: {
    objectFit: "cover",
    borderRadius: 6,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  backBtn: {
    marginTop: 24,
    padding: "10px 16px",
    border: "none",
    backgroundColor: "#3498db",
    color: "white",
    fontWeight: "bold",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default BookDetail;
