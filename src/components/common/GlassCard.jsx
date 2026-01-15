import { Card, styled } from "@mui/material";

const GlassCard = styled(Card)(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    overflow: "hidden",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.25)",
    },
}));

export default GlassCard;
