import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import useAuth from "../../features/auth/hooks/useAuth";
import MainLayout from "../../components/layout/MainLayout";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert
} from "@mui/material";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function MyFineList() {
    const { user, loading: authLoading } = useAuth();
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyFines = useCallback(async () => {
        if (!user) return;
        if (!user.id) {
            console.error("User ID is missing:", user);
            return;
        }
        setLoading(true);
        try {
            const token = getToken();
            const res = await axios.get(`http://localhost:8080/spring/fine/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.code === 1000) {
                setFines(res.data.status || []);
            }
        } catch (err) {
            console.error("Error fetching my fines:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchMyFines();
        }
    }, [user, fetchMyFines]);

    if (authLoading) return <LoadingSpinner />;
    if (!user) return <Typography sx={{ p: 3 }}>Please login to view fines.</Typography>;

    return (
        <MainLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
                    My Fines ⚠️
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View your overdue fines and payment status.
                </Typography>
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                {fines.length === 0 && !loading ? (
                    <Alert severity="success">You have no fines! Great job returning books on time. 🎉</Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'grey.200' }}>
                                <TableRow>
                                    <TableCell><strong>Book</strong></TableCell>
                                    <TableCell><strong>Reason</strong></TableCell>
                                    <TableCell><strong>Amount</strong></TableCell>
                                    <TableCell><strong>Due Date</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fines.map(fine => (
                                    <TableRow key={fine.fineId || Math.random()}>
                                        <TableCell>{fine.bookTitle || "Topup/Other"}</TableCell>
                                        <TableCell>{fine.reason || "N/A"}</TableCell>
                                        <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                            {(fine.amount !== undefined && fine.amount !== null) ? fine.amount.toLocaleString() : '0'} VNĐ
                                        </TableCell>
                                        <TableCell>{fine.dueDate || "N/A"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={fine.status || "UNKNOWN"}
                                                color={fine.status === 'PAID' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {fine.status !== 'PAID' && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Please contact admin to pay.
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </MainLayout>
    );
}
