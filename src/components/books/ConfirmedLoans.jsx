import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Chip
} from "@mui/material";
import Header from "../header/Header";

export default function ConfirmedLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ✅ Lấy userId
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

  // ✅ Lấy danh sách loans
  const fetchLoans = async () => {
    const userId = await fetchUserId();
    if (!userId) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/spring/loans/user/${userId}/active`,
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );

      let loanData = res.data?.status || [];
      loanData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      const updatedLoans = await Promise.all(
        loanData.map(async (loan) => {
          const detailsWithBooks = await Promise.all(
            loan.loanDetails.map(async (detail) => {
              try {
                const bookRes = await axios.get(
                  `http://localhost:8080/spring/books/${detail.bookId}`,
                  {
                    headers: { Authorization: `Bearer ${getToken()}` }
                  }
                );
                const bookInfo = bookRes.data?.status || {};
                return {
                  ...detail,
                  bookTitle: bookInfo.title || "Không rõ tên",
                  bookImage: bookInfo.imageUrls?.[0] || null,
                  extraDays: 7,
                };
              } catch {
                return {
                  ...detail,
                  bookTitle: "Không rõ tên",
                  bookImage: null,
                  extraDays: 7,
                };
              }
            })
          );
          return { ...loan, loanDetails: detailsWithBooks };
        })
      );

      setLoans(updatedLoans);
    } catch (err) {
      console.error("Lỗi lấy danh sách loan:", err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [navigate]);

  const handleExtendLoan = async (loanDetailId, extraDays) => {
    try {
      await axios.put(
        `http://localhost:8080/spring/loan-details/${loanDetailId}/extend`,
        null,
        {
          params: { extraDays },
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      alert("Gia hạn thành công!");
      fetchLoans();
    } catch (err) {
      console.error("Lỗi gia hạn:", err);
      alert(err.response?.data?.message || "Không thể gia hạn.");
    }
  };

  const handleReturnBook = async (loanDetailId, loanId, detailIndex) => {
    try {
      await axios.put(
        `http://localhost:8080/spring/loan-details/${loanDetailId}/return`,
        null,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const newLoans = [...loans];
      const loan = newLoans.find((l) => l.loanId === loanId);
      if (loan) {
        loan.loanDetails[detailIndex].status = "RETURNED";
        loan.loanDetails[detailIndex].returnDate = new Date().toISOString().split("T")[0];
      }
      setLoans(newLoans);

      await axios.put(
        `http://localhost:8080/spring/loans/${loanId}/check-completion`,
        null,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      fetchLoans();
    } catch (err) {
      console.error("Lỗi trả sách:", err);
      alert(err.response?.data?.message || "Không thể trả sách.");
    }
  };

  const handleReturnAllBooks = async (loanId) => {
    try {
      await axios.put(
        `http://localhost:8080/spring/loans/${loanId}/status`,
        null,
        {
          params: { status: "COMPLETED" },
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );
      alert("Đã trả toàn bộ sách!");
      fetchLoans();
    } catch (err) {
      console.error("Lỗi trả toàn bộ:", err);
      alert(err.response?.data?.message || "Không thể trả toàn bộ.");
    }
  };

  const filteredLoans = loans.filter((loan) => {
    if (filterStatus === "ALL") return true;
    return loan.status === filterStatus;
  });

  return (
    <>
      <Header
        cartCount={loans.reduce((total, loan) => {
          return total + loan.loanDetails.reduce((subTotal, detail) => subTotal + (detail.quantity || 0), 0);
        }, 0)}
      />

      <Box sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>📚 Quản lý đơn mượn</Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Bộ lọc trạng thái:</Typography>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: 250, ml: 2 }}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="CONFIRMED">Đang mượn (CONFIRMED)</MenuItem>
            <MenuItem value="COMPLETED">Hoàn thành (COMPLETED)</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <Grid item xs={12} md={6} key={loan.loanId}>
                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">📌 Mã đơn: {loan.loanId}</Typography>
                      <Chip label={loan.status} color={loan.status === "CONFIRMED" ? "warning" : "success"} />
                    </Box>
                    <Typography>Ngày mượn: {loan.startDate || "Chưa xác định"}</Typography>
                    <Typography>Ngày trả: {loan.returnDate || "Chưa trả hết"}</Typography>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">📖 Sách mượn:</Typography>
                    <List>
                      {loan.loanDetails.map((detail, index) => (
                        <ListItem
                          key={detail.loanDetailId || index}
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          {detail.bookImage && (
                            <img
                              src={detail.bookImage}
                              alt={detail.bookTitle}
                              style={{ width: 50, height: 70, borderRadius: 4 }}
                            />
                          )}
                          <ListItemText
                            primary={`${detail.bookTitle} (x${detail.quantity})`}
                            secondary={`Ngày trả dự kiến: ${detail.dueDate || "Chưa xác định"} | Trạng thái: ${detail.status} ${detail.returnDate ? `| Ngày trả: ${detail.returnDate}` : ""}`}
                          />
                          {detail.status === "BORROWED" && (
                            <>
                              <TextField
                                label="Số ngày"
                                type="number"
                                size="small"
                                sx={{ width: 90 }}
                                value={detail.extraDays}
                                onChange={(e) => {
                                  const newLoans = [...loans];
                                  newLoans.find(l => l.loanId === loan.loanId).loanDetails[index].extraDays = parseInt(e.target.value);
                                  setLoans(newLoans);
                                }}
                              />
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleExtendLoan(detail.loanDetailId, detail.extraDays || 7)}
                              >
                                Gia hạn
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleReturnBook(detail.loanDetailId, loan.loanId, index)}
                              >
                                Trả sách
                              </Button>
                            </>
                          )}
                        </ListItem>
                      ))}
                    </List>

                    {loan.status === "CONFIRMED" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReturnAllBooks(loan.loanId)}
                        sx={{ mt: 2 }}
                      >
                        Trả toàn bộ
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", mt: 5 }}>Không có đơn mượn nào phù hợp.</Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
