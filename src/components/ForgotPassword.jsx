import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/spring/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);

      setSnackbar({
        open: true,
        message: "Vui lòng kiểm tra email để đặt lại mật khẩu!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1200);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Lỗi hệ thống",
        severity: "error",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f3f4f6"
      px={2}
    >
      <Card
        sx={{
          minWidth: 360,
          maxWidth: 480,
          width: "100%",
          boxShadow: 6,
          borderRadius: 3,
          p: 4,
          background: "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h1"
            textAlign="center"
            fontWeight={600}
            color="primary"
            gutterBottom
          >
            Quên mật khẩu
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Nhập email để nhận liên kết đặt lại mật khẩu.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Địa chỉ email"
              fullWidth
              margin="normal"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
              size="large"
            >
              Gửi liên kết
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
        </CardContent>
      </Card>

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
