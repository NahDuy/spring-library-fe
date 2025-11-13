import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { getToken } from "../../services/localStorageService";
import Header from "../../components/header/Header";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("http://localhost:8080/spring/users/myInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.code === 1000) {
        setUser(data.status);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/login");
    fetchUserInfo(token);
  }, [navigate]);

  return (
    <>
      <Header />
      <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        {user ? (
          <Card
            sx={{
              width: 400,
              p: 4,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2">Username: {user.username}</Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
            <Typography variant="body2">Address: {user.address}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Join date: {new Date(user.joinDate).toLocaleDateString()}
            </Typography>
          </Card>
        ) : (
          <Box sx={{ mt: 20, textAlign: "center" }}>
            <CircularProgress />
            <Typography>Đang tải thông tin người dùng...</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
