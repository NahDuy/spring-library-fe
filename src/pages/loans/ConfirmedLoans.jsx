import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import {
  Box,
  Typography,
  CardContent,
  Divider,
  List,
  ListItem,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Chip,
  Paper
} from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ConfirmedLoans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchLoans = useCallback(async () => {
    try {
      // Get User ID
      const userRes = await axios.get("http://localhost:8080/spring/users/myInfo", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const userId = userRes.data.code === 1000 ? userRes.data.status.id : null;

      if (!userId) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/spring/loans/user/${userId}/active`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      let loanData = res.data?.status || [];
      loanData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      // Fetch Book Details for each loan
      const updatedLoans = await Promise.all(
        loanData.map(async (loan) => {
          const detailsWithBooks = await Promise.all(
            loan.loanDetails.map(async (detail) => {
              try {
                const bookRes = await axios.get(
                  `http://localhost:8080/spring/books/${detail.bookId}`,
                  { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                const bookInfo = bookRes.data?.status || {};
                return {
                  ...detail,
                  bookTitle: bookInfo.title || "Unknown Title",
                  bookImage: bookInfo.imageUrls?.[0] || null,
                  extraDays: 7,
                };
              } catch {
                return { ...detail, bookTitle: "Unknown Title", bookImage: null, extraDays: 7 };
              }
            })
          );
          return { ...loan, loanDetails: detailsWithBooks };
        })
      );

      setLoans(updatedLoans);
    } catch (err) {
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

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
      alert("Extension successful!");
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot extend.");
    }
  };





  const filteredLoans = loans.filter((loan) => {
    if (filterStatus === "ALL") return true;
    return loan.status === filterStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout
      cartCount={loans.reduce((total, loan) => {
        return total + loan.loanDetails.reduce((subTotal, detail) => subTotal + (detail.quantity || 0), 0);
      }, 0)}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
          My Loans 📚
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your borrowed books and fines.
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2, bgcolor: "white", p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>Filter Status:</Typography>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="CONFIRMED">Borrowed (Active)</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <Grid item xs={12} md={6} key={loan.loanId}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <CardContent sx={{ p: 0 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={700}>Loan #{loan.loanId.slice(-6).toUpperCase()}</Typography>
                    <Chip
                      label={loan.status}
                      color={loan.status === "CONFIRMED" ? "warning" : "success"}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 4, mb: 2, color: "text.secondary", fontSize: "0.9rem" }}>
                    <Typography>Start: {loan.startDate || "N/A"}</Typography>
                    <Typography>Due: {loan.returnDate || "Variable"}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 1, color: "text.secondary" }}>
                    Books
                  </Typography>

                  <List disablePadding>
                    {loan.loanDetails.map((detail, index) => (
                      <ListItem
                        key={detail.loanDetailId || index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          px: 0,
                          py: 2,
                          borderBottom: index < loan.loanDetails.length - 1 ? "1px solid #f0f0f0" : "none"
                        }}
                      >
                        {detail.bookImage && (
                          <Box
                            component="img"
                            src={detail.bookImage}
                            alt={detail.bookTitle}
                            sx={{ width: 60, height: 90, borderRadius: 1, objectFit: "cover", boxShadow: 1 }}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {detail.bookTitle} <Typography component="span" variant="body2" color="text.secondary">(x{detail.quantity})</Typography>
                          </Typography>
                          <Typography variant="body2" color={detail.status === "RETURNED" ? "success.main" : "warning.main"}>
                            Status: {detail.status}
                          </Typography>
                          {detail.dueDate && <Typography variant="caption" display="block">Due: {detail.dueDate}</Typography>}
                        </Box>


                        {/* Actions Column */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {detail.status === "BORROWED" && (
                            <>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <TextField
                                  label="Days"
                                  type="number"
                                  size="small"
                                  sx={{ width: 70 }}
                                  value={detail.extraDays}
                                  onChange={(e) => {
                                    const newLoans = [...loans];
                                    // Note: mutating state directly for deep nested updates in list is messy, 
                                    // but for input binding this is a common dirty pattern. 
                                    // Ideally use a better state manager or immutable update.
                                    const l = newLoans.find(x => x.loanId === loan.loanId);
                                    l.loanDetails[index].extraDays = parseInt(e.target.value) || 0;
                                    setLoans(newLoans);
                                  }}
                                />
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleExtendLoan(detail.loanDetailId, detail.extraDays || 7)}
                                >
                                  Extend
                                </Button>
                              </Box>
                              {/* <Button
                                variant="contained"
                                color="success"
                                size="small"
                                fullWidth
                                onClick={() => handleReturnBook(detail.loanDetailId, loan.loanId, index)}
                              >
                                Return
                              </Button> */}
                            </>
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                  {/* 
                  {loan.status === "CONFIRMED" && (
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      onClick={() => handleReturnAllBooks(loan.loanId)}
                      sx={{ mt: 3 }}
                    >
                      Return Process (All Books)
                    </Button>
                  )} */}
                </CardContent>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 10, opacity: 0.5 }}>
              <Typography variant="h5">No loans found matching this filter.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
}
