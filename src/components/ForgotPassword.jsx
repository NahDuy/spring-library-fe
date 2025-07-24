// src/components/ForgotPassword.jsx
import { useState } from "react";
import { Box, Button, Card, CardContent, Snackbar, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
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
            navigate("/reset-password", { state: { email } });
            setSnackbar({ open: true, message: "Check your email for reset link!", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f0f2f5">
            <Card sx={{ minWidth: 400, maxWidth: 500, padding: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Forgot Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Enter your email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
