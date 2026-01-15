import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Paper
} from "@mui/material";
import { getToken } from "../../services/localStorageService";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PersonIcon from "@mui/icons-material/Person";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/spring/users/myInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.code === 1000) {
          setUser(data.status);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        {user ? (
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 500,
              p: 5,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative Background */}
            <Box sx={{
              position: "absolute", top: 0, left: 0, right: 0, height: 100,
              background: "linear-gradient(45deg, #1a237e, #534bae)"
            }} />

            <Avatar sx={{
              width: 100, height: 100,
              bgcolor: "secondary.main",
              border: "4px solid white",
              mt: 4, mb: 2,
              fontSize: 40
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon fontSize="inherit" />}
            </Avatar>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>

            <Divider sx={{ width: "100%", my: 3 }} />

            <Box sx={{ width: "100%", textAlign: "left" }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">Email</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">Address</Typography>
                <Typography variant="body1">{user.address || "No address provided"}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">Member Since</Typography>
                <Typography variant="body1">{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}</Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Typography>User not found.</Typography>
        )}
      </Box>
    </MainLayout>
  );
}
