import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../services/localStorageService";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [joinDate] = useState(new Date().toISOString());

  useEffect(() => {
    const accessToken = getToken();
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/spring/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);
        setToken(data.status?.token);
        navigate("/");
      })
      .catch((err) => {
        setSnackBarMessage(err.message);
        setSnackBarOpen(true);
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();

    const payload = {
      username,
      password,
      name,
      email,
      address,
      joinDate,
      dob,
    };

    fetch("http://localhost:8080/spring/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);
        alert("Đăng ký thành công. Vui lòng đăng nhập.");
        setIsRegistering(false);
      })
      .catch((err) => {
        setSnackBarMessage(err.message);
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor="#eef1f5"
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
              gutterBottom
              sx={{ color: "#2c3e50", fontWeight: 600 }}
            >
              {isRegistering ? "Đăng ký tài khoản" : "Chào mừng đến thư viện"}
            </Typography>

            <Box
              component="form"
              display="flex"
              flexDirection="column"
              gap={2}
              onSubmit={isRegistering ? handleRegister : handleSubmit}
            >
              <TextField
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              {isRegistering && (
                <>
                  <TextField
                    label="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Ngày sinh"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    fullWidth
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                {isRegistering ? "Đăng ký" : "Đăng nhập"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" flexDirection="column" gap={1}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "Quay lại đăng nhập" : "Tạo tài khoản mới"}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
