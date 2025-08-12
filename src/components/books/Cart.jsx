import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Paper,
    Divider
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Header from "../header/Header";

export default function Cart() {
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);

    // ✅ Lấy userId (dùng axios thay vì fetch)
    const fetchUserId = async () => {
        try {
            const res = await axios.get("http://localhost:8080/spring/users/myInfo", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = res.data;
            return data.code === 1000 ? data.status.id : null;
        } catch (err) {
            console.error("Lỗi lấy userId:", err);
            return null;
        }
    };

    // ✅ Lấy loan hiện tại
    const fetchLoan = async () => {
        const userId = await fetchUserId();
        if (!userId) {
            alert("Vui lòng đăng nhập!");
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/spring/loans/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            let loanData = res.data?.status || null;

            // ✅ Lấy thêm thông tin sách
            if (loanData && loanData.loanDetails?.length > 0) {
                const updatedDetails = await Promise.all(
                    loanData.loanDetails.map(async (detail) => {
                        try {
                            const bookRes = await axios.get(
                                `http://localhost:8080/spring/books/${detail.bookId}`,
                                {
                                    headers: { Authorization: `Bearer ${getToken()}` },
                                }
                            );
                            const bookInfo = bookRes.data?.status || {};
                            return {
                                ...detail,
                                bookTitle: bookInfo.title || "Không rõ tên",
                                bookImage: bookInfo.imageUrls?.[0] || null
                            };
                        } catch (err) {
                            console.error("Lỗi lấy thông tin sách:", err);
                            return {
                                ...detail,
                                bookTitle: "Không rõ tên",
                                bookImage: null
                            };
                        }
                    })
                );
                loanData.loanDetails = updatedDetails;
            }

            setLoan(loanData);
        } catch (err) {
            console.error("Không tìm thấy Loan:", err);
            setLoan(null);
        }
    };

    useEffect(() => {
        fetchLoan();
    }, [navigate]);

    // ✅ Xác nhận mượn
    const handleConfirmLoan = async () => {
        if (!loan?.loanId) {
            alert("Không tìm thấy Loan.");
            return;
        }

        try {
            await axios.put(
                `http://localhost:8080/spring/loans/${loan.loanId}/status`,
                null,
                {
                    params: { status: "CONFIRMED" },
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            alert("Đã xác nhận mượn sách!");
            navigate("/confirmed-loans");
        } catch (err) {
            console.error("Lỗi khi xác nhận mượn:", err);
            alert("Không thể xác nhận mượn sách.");
        }
    };

    if (!loan) {
        return (
            <>
                <Header cartCount={0} />
                <Typography sx={{ textAlign: "center", mt: 5 }}>Giỏ hàng trống.</Typography>
            </>
        );
    }

    return (
        <>
            <Header cartCount={loan?.loanDetails?.reduce((total, item) => total + (item.quantity || 0), 0) || 0} />
            <Box sx={{ p: 4, mt: 10 }}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <ShoppingCartIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                        <Typography variant="h5" fontWeight="bold">Giỏ hàng của bạn</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Ảnh</b></TableCell>
                                <TableCell><b>Tên sách</b></TableCell>
                                <TableCell><b>Số lượng</b></TableCell>
                                <TableCell><b>Ngày trả dự kiến</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loan.loanDetails?.map((detail) => (
                                <TableRow key={detail.loanDetailId} hover>
                                    <TableCell>
                                        {detail.bookImage ? (
                                            <Avatar
                                                src={detail.bookImage}
                                                alt={detail.bookTitle}
                                                variant="rounded"
                                                sx={{ width: 50, height: 70, border: "1px solid #ccc" }}
                                            />
                                        ) : (
                                            <Avatar variant="rounded" sx={{ width: 50, height: 70 }}>?</Avatar>
                                        )}
                                    </TableCell>
                                    <TableCell>{detail.bookTitle}</TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>{detail.dueDate || "Chưa xác định"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button
                        sx={{
                            mt: 3,
                            background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                            fontWeight: "bold",
                            color: "#fff",
                            px: 3,
                            "&:hover": {
                                background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                            }
                        }}
                        variant="contained"
                        onClick={handleConfirmLoan}
                    >
                        ✅ Xác nhận mượn
                    </Button>
                </Paper>
            </Box>
        </>
    );
}
