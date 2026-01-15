import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import {
    Box,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from "@mui/material";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

export default function AdminFineManagement() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchFines = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const params = {};
            if (filterStatus !== "ALL") {
                params.status = filterStatus; // UNPAID or PAID
            }

            const res = await axios.get("http://localhost:8080/spring/fine", {
                headers: { Authorization: `Bearer ${token}` },
                params: params
            });

            if (res.data.code === 1000) {
                let fineData = res.data.status || [];
                // Sort by creation date desc
                // fineData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setFines(fineData);
            }
        } catch (err) {
            console.error("Error fetching admin fines:", err);
            // showToast("Failed to fetch fines", "error");
        } finally {
            setLoading(false);
        }
    }, [navigate, filterStatus]);

    useEffect(() => {
        fetchFines();
    }, [fetchFines]);

    const handlePayFine = async (fineId) => {
        try {
            await axios.put(
                `http://localhost:8080/spring/fine/${fineId}/pay`,
                null,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            showToast("Fine marked as PAID", "success");
            fetchFines();
        } catch (err) {
            showToast("Failed to pay fine", "error");
        }
    };

    const filteredFines = fines.filter(fine => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            (fine.userName && fine.userName.toLowerCase().includes(lowerTerm)) ||
            (fine.reason && fine.reason.toLowerCase().includes(lowerTerm))
        );
    });

    if (loading) return <LoadingSpinner />;

    return (
        <MainLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
                    Fine Management 💸
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Admin dashboard for managing overdue fines.
                </Typography>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={filterStatus}
                            label="Status Filter"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="ALL">All Fines</MenuItem>
                            <MenuItem value="ALL">All Fines</MenuItem>
                            <MenuItem value="PENDING">Pending (Unpaid)</MenuItem>
                            <MenuItem value="PAID">Paid</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Search by Username or Reason"
                        size="small"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button variant="contained" onClick={fetchFines}>Refresh</Button>
                </Box>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'error.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFines.length > 0 ? filteredFines.map((fine) => (
                            <TableRow key={fine.fineId} hover>
                                <TableCell>{fine.userName || fine.fullName || "Unknown"}</TableCell>
                                <TableCell>{fine.amount?.toLocaleString()} VNĐ</TableCell>
                                <TableCell>{fine.reason}</TableCell>
                                <TableCell>{fine.dueDate}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={fine.status}
                                        color={fine.status === "PAID" ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {fine.status !== "PAID" && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handlePayFine(fine.fineId)}
                                        >
                                            Mark Paid
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No fines found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainLayout>
    );
}
