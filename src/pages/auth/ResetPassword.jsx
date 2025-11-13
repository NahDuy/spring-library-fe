import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/spring/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (data.code === 1000) {
        setSnackbar({ open: true, message: "Đổi mật khẩu thành công!", severity: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        throw new Error(data.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  if (!email) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8">
        <Paper elevation={4} sx={{ p: 4, minWidth: 300, maxWidth: 450 }}>
          <Typography variant="h6" align="center">
            Không có email. Vui lòng quay lại và thử lại.
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={() => navigate("/forgot-password")}>
              Quay lại
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8">
      <Paper elevation={6} sx={{ p: 4, minWidth: 360, maxWidth: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          🔐 Đặt lại mật khẩu
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            disabled
          />
          <TextField
            label="Mã xác nhận"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ mt: 2 }}
          >
            ✅ Đổi mật khẩu
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate("/login")}
          >
            🔙 Quay lại đăng nhập
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPassword;
