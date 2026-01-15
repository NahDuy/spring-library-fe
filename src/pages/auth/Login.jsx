import {
  Box,
  CardContent,
  Divider,
  TextField,
  Typography,
  Paper
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/localStorageService";
import PremiumButton from "../../components/common/PremiumButton";

import { useToast } from "../../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");


  // ... useEffect

  // Removed handleCloseSnackBar

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
        showToast("Login successful!", "success");
        navigate("/");
      })
      .catch((err) => {
        showToast(err.message, "error");
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
      joinDate: new Date().toISOString().split('T')[0], // yyyy-MM-dd
      dob: dob ? dob : null,
    };

    fetch("http://localhost:8080/spring/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 1000) throw new Error(data.message);
        showToast("Registration successful. Please login.", "success");
        setIsRegistering(false);
      })
      .catch((err) => {
        showToast(err.message, "error");
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #534bae 100%)",
        p: 2
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header Strip */}
        <Box sx={{ bgcolor: "primary.main", p: 3, textAlign: "center" }}>
          <Typography variant="h5" color="white" fontWeight="bold">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            Spring Library App
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2.5}
            onSubmit={isRegistering ? handleRegister : handleSubmit}
          >
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            {isRegistering && (
              <>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  fullWidth
                />
              </>
            )}

            <PremiumButton
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: '16px' }}
            >
              {isRegistering ? "Sign Up" : "Login"}
            </PremiumButton>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Box display="flex" flexDirection="column" gap={1.5} alignItems="center">
            <PremiumButton
              variant="outlined"
              fullWidth
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an account? Login" : "Create New Account"}
            </PremiumButton>

            <PremiumButton
              variant="text"
              style={{ fontSize: '0.875rem', textDecoration: 'underline' }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </PremiumButton>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
}
