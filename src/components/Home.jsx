import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";
import { Box, Card, CircularProgress, Typography } from "@mui/material";

export default function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null); // null để dễ kiểm tra loading

  const getUserDetails = async (accessToken) => {
    const response = await fetch("http://localhost:8080/spring/users/myInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data);

    setUserDetails(data.status);
  };

  useEffect(() => {
    const accessToken = getToken();
    console.log("accessToken", accessToken);

    if (!accessToken) {
      navigate("/login");
    } else {
      getUserDetails(accessToken);
    }
  }, [navigate]);

  return (
    <>
      <Header />
      {userDetails ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor={"#f0f2f5"}
        >
          <Card
            sx={{
              minWidth: 350,
              maxWidth: 500,
              boxShadow: 4,
              borderRadius: 4,
              padding: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                gap: "10px",
              }}
            >
              <Typography sx={{ fontSize: 18, mb: "40px" }}>
                Welcome back to libary, {userDetails.username}!
              </Typography>

              <UserField label="User Id" value={userDetails.id} />
              <UserField label="Full Name" value={userDetails.name} />
              <UserField label="Email" value={userDetails.email} />
              <UserField label="Address" value={userDetails.address} />
              <UserField
                label="Join Date"
                value={new Date(userDetails.joinDate).toLocaleString()}
              />
            </Box>
          </Card>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
          <Typography>Loading ...</Typography>
        </Box>
      )}
    </>
  );
}

// Tạo component con để hiển thị từng dòng thông tin cho gọn code
function UserField({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 14 }}>{value || "N/A"}</Typography>
    </Box>
  );
}
