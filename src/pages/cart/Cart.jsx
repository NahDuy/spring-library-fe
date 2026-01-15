import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Paper,
    Divider,
    IconButton,
    CircularProgress
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/header/Header";
import { useToast } from "../../context/ToastContext";

export default function Cart() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Cart
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/spring/cart/my-cart", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.data.code === 1000) {
                setCart(res.data.status);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            // Don't show toast on 404 (empty cart) if backend returns that, but usually it returns empty structure
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [navigate]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(
                `http://localhost:8080/spring/cart/item/${itemId}`,
                null,
                {
                    params: { quantity: newQuantity },
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );
            fetchCart(); // Refresh cart
        } catch (err) {
            showToast("Failed to update quantity", "error");
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8080/spring/cart/item/${itemId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            showToast("Item removed", "success");
            fetchCart();
        } catch (err) {
            showToast("Failed to remove item", "error");
        }
    };

    const handleCheckout = async () => {
        if (!cart?.items?.length) {
            showToast("Cart is empty", "warning");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/spring/cart/checkout",
                {},
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );

            showToast("Order placed successfully!", "success");
            navigate("/confirmed-loans");
        } catch (err) {
            console.error("Checkout error:", err);
            showToast("Checkout failed. Please try again.", "error");
        }
    };

    if (isLoading) {
        return (
            <>
                <Header cartCount={0} />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <>
                <Header cartCount={0} />
                <Typography sx={{ textAlign: "center", mt: 10, fontSize: '1.2rem', color: 'text.secondary' }}>
                    Your cart is empty.
                </Typography>
            </>
        );
    }

    return (
        <>
            <Header cartCount={cart.totalItems || 0} />
            <Box sx={{ p: 4, mt: 10, maxWidth: 1000, mx: "auto" }}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <ShoppingCartIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                        <Typography variant="h5" fontWeight="bold">Your Shopping Cart</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Product</b></TableCell>
                                <TableCell><b>Quantity</b></TableCell>
                                <TableCell align="right"><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.items.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={item.bookImage}
                                            variant="rounded"
                                            sx={{ width: 60, height: 80 }}
                                        >
                                            B
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {item.bookTitle}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button
                            sx={{
                                background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                                fontWeight: "bold",
                                color: "#fff",
                                px: 4,
                                py: 1.5,
                                borderRadius: 8,
                                "&:hover": {
                                    background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                                }
                            }}
                            variant="contained"
                            onClick={handleCheckout}
                        >
                            Checkout ({cart.totalItems} items)
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}
