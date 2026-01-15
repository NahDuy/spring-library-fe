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
    TextField,
    IconButton,
    Collapse
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

function Row({ loan, onReturnBook, onReturnAll, onUpdateStatus }) {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset', bgcolor: 'background.paper' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    #{loan.loanId.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{loan.user?.username || "Unknown User"}</TableCell>
                <TableCell>{loan.startDate}</TableCell>
                <TableCell>{loan.returnDate || "-"}</TableCell>
                <TableCell>
                    <Chip
                        label={loan.status}
                        color={loan.status === 'CONFIRMED' ? 'warning' : loan.status === 'COMPLETED' ? 'success' : 'default'}
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    {loan.status === 'CONFIRMED' && (
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => onReturnAll(loan.loanId)}
                        >
                            Return All
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                Loan Details (Books)
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Book Title</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Due Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loan.loanDetails.map((detail) => (
                                        <TableRow key={detail.loanDetailId}>
                                            <TableCell component="th" scope="row">
                                                {detail.bookTitle || "Loading..."}
                                            </TableCell>
                                            <TableCell>{detail.quantity}</TableCell>
                                            <TableCell>{detail.dueDate}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={detail.status}
                                                    color={detail.status === 'BORROWED' ? 'warning' : 'success'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {detail.status === 'BORROWED' && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => onReturnBook(detail.loanDetailId, loan.loanId)}
                                                    >
                                                        Return Item
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function AdminLoanManagement() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            // Prepare query param
            const params = {};
            if (filterStatus !== "ALL") {
                params.status = filterStatus;
            }

            const res = await axios.get("http://localhost:8080/spring/loans", {
                headers: { Authorization: `Bearer ${token}` },
                params: params
            });

            if (res.data.code === 1000) {
                let loanData = res.data.status || [];
                // Sort by date desc
                loanData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

                // Fetch book titles for details
                // Note: Ideally backend response should include book titles. 
                // If not, we might need to fetch them. Assuming backend might not return titles in LoanResponse structure yet?
                // Let's check LoanResponse. The previous output didn't show it explicitly, but usually it maps entities.
                // If Book entity is inside LoanDetail, it should be there. 
                // Let's assume we need to fill it if missing, similar to ConfirmedLoans.

                const updatedLoans = await Promise.all(
                    loanData.map(async (loan) => {
                        const detailsWithBooks = await Promise.all(
                            loan.loanDetails.map(async (detail) => {
                                if (detail.bookTitle) return detail; // Already has title
                                try {
                                    // If detail.book (object) exists, use it.
                                    if (detail.book && detail.book.title) {
                                        return { ...detail, bookTitle: detail.book.title };
                                    }
                                    // Else fetch
                                    const bookRes = await axios.get(
                                        `http://localhost:8080/spring/books/${detail.bookId}`,
                                        { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                    return { ...detail, bookTitle: bookRes.data?.status?.title || "Unknown" };
                                } catch {
                                    return { ...detail, bookTitle: "Unknown" };
                                }
                            })
                        );
                        return { ...loan, loanDetails: detailsWithBooks };
                    })
                );
                setLoans(updatedLoans);
            }
        } catch (err) {
            console.error("Error fetching admin loans:", err);
            showToast("Failed to fetch loans", "error");
        } finally {
            setLoading(false);
        }
    }, [navigate, filterStatus, showToast]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleReturnBook = async (loanDetailId, loanId) => {
        try {
            await axios.put(
                `http://localhost:8080/spring/loan-details/${loanDetailId}/return`,
                null,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            await axios.put(
                `http://localhost:8080/spring/loans/${loanId}/check-completion`,
                null,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            showToast("Book returned successfully", "success");
            fetchLoans();
        } catch (err) {
            showToast("Failed to return book", "error");
        }
    };

    const handleReturnAllBooks = async (loanId) => {
        try {
            await axios.put(
                `http://localhost:8080/spring/loans/${loanId}/status`,
                null,
                {
                    params: { status: "COMPLETED" },
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );
            showToast("Loan marked as COMPLETED", "success");
            fetchLoans();
        } catch (err) {
            showToast("Failed to update loan status", "error");
        }
    };


    const filteredLoans = loans.filter(loan => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            loan.loanId.toLowerCase().includes(lowerTerm) ||
            loan.user?.username?.toLowerCase().includes(lowerTerm)
        );
    });

    if (loading) return <LoadingSpinner />;

    return (
        <MainLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "primary.main" }}>
                    Loan Management 🛡️
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Admin dashboard for managing all user loans.
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
                            <MenuItem value="ALL">All Loans</MenuItem>
                            <MenuItem value="CONFIRMED">Confirmed (Active)</MenuItem>
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Search by Loan ID or Username"
                        size="small"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button variant="contained" onClick={fetchLoans}>Refresh</Button>
                </Box>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table aria-label="collapsible table">
                    <TableHead sx={{ bgcolor: 'primary.light' }}>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Loan ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Return Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLoans.length > 0 ? filteredLoans.map((loan) => (
                            <Row
                                key={loan.loanId}
                                loan={loan}
                                onReturnBook={handleReturnBook}
                                onReturnAll={handleReturnAllBooks}
                            />
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="h6" color="text.secondary">No loans found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainLayout>
    );
}
