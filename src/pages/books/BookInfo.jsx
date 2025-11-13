import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box, Typography, Button, TextField,
    Card, CardContent, CardMedia
} from "@mui/material";
import Header from "../../components/header/Header";
import { getToken } from "../../services/localStorageService";

export default function BookInfo() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [rentQuantity, setRentQuantity] = useState(1);

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/spring/books/${bookId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                setBook(res.data?.status);
            } catch (err) {
                console.error("Không lấy được chi tiết sách:", err);
                navigate("/");
            }
        };
        fetchBook();
    }, [bookId, navigate]);

    useEffect(() => {
        const fetchRelatedBooks = async () => {
            if (!book?.category?.categoryId) return;
            try {
                const res = await axios.get(
                    `http://localhost:8080/spring/books/related/${book.category.categoryId}`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    }
                );
                const all = res.data?.status || [];
                const filtered = all.filter((b) => b.bookID !== book.bookID);
                setRelatedBooks(filtered);
            } catch (err) {
                console.error("Lỗi lấy sách cùng thể loại:", err);
            }
        };
        fetchRelatedBooks();
    }, [book]);

    const fetchUserId = async () => {
        try {
            const res = await axios.get("http://localhost:8080/spring/users/myInfo", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = res.data;
            return data.code === 1000 ? data.status.id : null;
        } catch (err) {
            console.error("Lỗi khi lấy userId:", err);
            return null;
        }
    };

    const handleAddToCart = async () => {
        try {
            const userId = await fetchUserId();
            if (!userId) {
                alert("Vui lòng đăng nhập để thuê sách!");
                navigate("/login");
                return;
            }

            const loanRes = await axios.post(
                `http://localhost:8080/spring/loans/user/${userId}/auto-create`,
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            if (!loanRes.data?.status?.loanId) {
                alert("Không thể tạo hoặc lấy Loan.");
                return;
            }

            const loanId = loanRes.data.status.loanId;

            const addRes = await axios.post(
                `http://localhost:8080/spring/loan-details/add`,
                {
                    loanId: loanId,
                    bookId: book.bookID,
                    quantity: rentQuantity
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            if (addRes.data?.code === 1000) {
                alert(`Đã thêm ${rentQuantity} cuốn "${book.title}" vào giỏ hàng.`);
            } else {
                alert("Thêm sách vào giỏ thất bại.");
            }
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ:", err);
            alert("Không thể thêm sách vào giỏ.");
        }
    };

    const handleRentNow = async () => {
        try {
            const userId = await fetchUserId();
            if (!userId) {
                alert("Vui lòng đăng nhập để thuê sách!");
                navigate("/login");
                return;
            }

            const loanRes = await axios.post(
                `http://localhost:8080/spring/loans/user/${userId}/auto-create`,
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            if (!loanRes.data?.status?.loanId) {
                alert("Không thể tạo hoặc lấy Loan.");
                return;
            }

            const loanId = loanRes.data.status.loanId;

            const addRes = await axios.post(
                `http://localhost:8080/spring/loan-details/add`,
                {
                    loanId: loanId,
                    bookId: book.bookID,
                    quantity: rentQuantity
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            if (addRes.data?.code !== 1000) {
                alert("Không thể thêm sách vào đơn mượn.");
                return;
            }

            await axios.put(
                `http://localhost:8080/spring/loans/${loanId}/status`,
                null,
                {
                    params: { status: "CONFIRMED" },
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );

            alert("Thuê sách thành công!");
            navigate("/confirmed-loans");

        } catch (err) {
            console.error("Lỗi khi thuê ngay:", err);
            alert("Không thể thuê sách.");
        }
    };

    if (!book) {
        return <p style={{ textAlign: "center", marginTop: 50 }}>Đang tải thông tin sách...</p>;
    }

    return (
        <>
            <Header cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
            <Box sx={styles.container}>
                <Box sx={styles.card}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {book.title}
                    </Typography>
                    <Typography gutterBottom><strong>Tác giả:</strong> {book.author}</Typography>
                    <Typography gutterBottom><strong>Mô tả:</strong> {book.description}</Typography>
                    <Typography gutterBottom>
                        <strong>Số lượng còn:</strong> {book.availableCopies}/{book.totalCopies}
                    </Typography>

                    {book.imageUrls?.[0] && (
                        <img
                            src={book.imageUrls[0]}
                            alt="Ảnh sách"
                            style={styles.image}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    )}

                    <Box mt={3} display="flex" alignItems="center" gap={2}>
                        <Typography>Chọn số lượng:</Typography>
                        <TextField
                            type="number"
                            size="small"
                            inputProps={{
                                min: 1,
                                max: book.availableCopies,
                            }}
                            value={rentQuantity}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && val <= book.availableCopies) {
                                    setRentQuantity(val);
                                }
                            }}
                            sx={{ width: 100 }}
                        />
                        <Button variant="outlined" color="secondary" onClick={handleAddToCart}>
                            🛒 Thêm vào giỏ
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleRentNow}>
                            🚀 Thuê ngay
                        </Button>
                        <Button onClick={() => navigate(-1)} variant="outlined">
                            ⬅️ Quay lại
                        </Button>
                    </Box>
                </Box>

                {relatedBooks.length > 0 && (
                    <Box sx={{ mt: 6, maxWidth: "800px", width: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            📚 Các sách cùng thể loại
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {relatedBooks.map((b) => (
                                <Card
                                    key={b.bookID}
                                    sx={{ width: 180, cursor: "pointer" }}
                                    onClick={() => navigate(`/book-info/${b.bookID}`)}
                                >
                                    {b.imageUrls?.[0] && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={b.imageUrls[0]}
                                            alt={b.title}
                                            onError={(e) => (e.target.style.display = "none")}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {b.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {b.author}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "120px 24px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    card: {
        background: "#fff",
        padding: 32,
        borderRadius: 12,
        maxWidth: 800,
        width: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    image: {
        width: "100%",
        maxHeight: 280,
        objectFit: "cover",
        marginTop: 16,
        borderRadius: 8,
    },
};
