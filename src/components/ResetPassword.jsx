import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
        alert("Password has been reset successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Reset failed!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (!email) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" align="center">
            Email not provided. Please go back and try again.
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={() => navigate("/forgot-password")}>
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Hiển thị email dưới dạng disabled nếu muốn */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            disabled
          />
          <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Box textAlign="center" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Reset Password
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default ResetPassword;
