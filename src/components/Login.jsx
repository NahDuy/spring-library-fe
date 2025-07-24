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

import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../services/localStorageService";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  // Đăng ký
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
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f0f2f5">
        <Card sx={{ minWidth: 400, maxWidth: 500, boxShadow: 4, borderRadius: 4, padding: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              {isRegistering ? "Register an account" : "Welcome to libary"}
            </Typography>

            <Box component="form" display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" onSubmit={isRegistering ? handleRegister : handleSubmit}>
              <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

              {isRegistering && (
                <>
                  <TextField label="Full Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
                  <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField label="Address" variant="outlined" fullWidth margin="normal" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={dob} onChange={(e) => setDob(e.target.value)} />
                </>
              )}

              <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: "15px", mb: "25px" }}>
                {isRegistering ? "Register" : "Login"}
              </Button>
              <Divider />
            </Box>

            <Box display="flex" flexDirection="column" width="100%" gap="25px" mt={2}>
              
              <Button type="button" variant="outlined" color="success" size="large" fullWidth onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Back to Login" : "Create an account"}
              </Button>
              <Button
                type="button"
                variant="text"
                color="primary"
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Button>

            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
