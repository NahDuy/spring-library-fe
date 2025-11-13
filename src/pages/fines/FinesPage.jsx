import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip
} from "@mui/material";
import Header from "../../components/header/Header";
import { getToken } from "../../services/localStorageService";
export default function FinesPage() {
  const [fines, setFines] = useState([]);
  const [loanDetails, setLoanDetails] = useState([]);
  const [userId, setUserId] = useState(null);

  // ✅ Lấy userId
  const fetchUserId = async () => {
    try {
      const res = await fetch("http://localhost:8080/spring/users/myInfo", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setUserId(data.status?.id || null);
    } catch (err) {
      console.error("Lỗi lấy userId:", err);
    }
  };

  // ✅ Lấy danh sách loanDetails đã RETURNED
  const fetchLoanDetails = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `http://localhost:8080/spring/loan-details/user/${userId}?status=RETURNED`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      setLoanDetails(data.status || []);
    } catch (err) {
      console.error("Lỗi lấy loanDetails:", err);
    }
  };

  // ✅ Lấy fine cho từng loanDetail bằng GET
  const fetchFinesForLoanDetails = async () => {
    const finesList = [];
    for (const detail of loanDetails) {
      try {
        const res = await fetch(
          `http://localhost:8080/spring/fine/loanDetail/${detail.loanDetailId}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const data = await res.json();
        if (data.status) {
          finesList.push(data.status);
        }
      } catch (err) {
        console.error(`Lỗi lấy tiền phạt cho ${detail.loanDetailId}:`, err);
      }
    }
    setFines(finesList);
  };

  // ✅ Thanh toán VNPay QR
  const handlePayFine = async (fine) => {
    try {
      const amount = fine.amount; // số tiền phạt
      console.log("Thanh toán VNPay, amount =", amount);

      const res = await fetch(
        `http://localhost:8080/spring/payment/vn-pay?amount=${amount}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const data = await res.json();

      if (data?.status.paymentUrl) {
        window.location.href = data.status.paymentUrl; // ⬅️ Redirect sang VNPAY
      } else {
        alert("❌ Không lấy được URL thanh toán!");
      }
    } catch (err) {
      console.error("Lỗi thanh toán VNPay:", err);
      alert("Thanh toán thất bại!");
    }
  };


  // ✅ Load dữ liệu
  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLoanDetails();
    }
  }, [userId]);

  useEffect(() => {
    if (loanDetails.length > 0) {
      fetchFinesForLoanDetails();
    }
  }, [loanDetails]);

  return (
    <>
      <Header />
      <Box sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          💰 Danh sách tiền phạt
        </Typography>

        {fines.length > 0 ? (
          <Grid container spacing={2}>
            {fines.map((fine) => (
              <Grid item xs={12} md={6} lg={4} key={fine.fineId}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="error">
                      {fine.bookTitle}
                    </Typography>
                    <Typography variant="body1">
                      💵 Tiền phạt: <b>{fine.amount.toLocaleString()}₫</b>
                    </Typography>
                    <Typography variant="body2">
                      📅 Ngày phát: {fine.createdDate}
                    </Typography>
                    <Typography variant="body2">
                      ❌ Lý do: {fine.reason}
                    </Typography>
                    <Chip
                      label={fine.status}
                      color={fine.status === "PAID" ? "success" : "warning"}
                      sx={{ mt: 1 }}
                    />
                    {fine.status === "PENDING" && (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handlePayFine(fine)}
                      >
                        💳 Thanh toán
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Không có khoản phạt nào.</Typography>
        )}
      </Box>
    </>
  );
}
