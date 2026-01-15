import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import CategoryList from "../pages/categorys/CategoryList"
import BookListByCategory from '../pages/categorys/BookListByCategory';
import BookDetail from '../pages/books/BookDetail';
import Profile from "../pages/profile/Profile";
import BookInfo from "../pages/books/BookInfo";
import Cart from "../pages/cart/Cart";
import ConfirmedLoans from "../pages/loans/ConfirmedLoans";
import FinesPage from "../pages/fines/FinesPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import AdminLoanManagement from "../pages/admin/AdminLoanManagement";
import AdminFineManagement from "../pages/admin/AdminFineManagement";
import MyFineList from "../pages/fines/MyFineList";
import FavoritesPage from "../pages/favorites/FavoritesPage";
import AdminBookList from "../pages/admin/AdminBookList";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/books/:categoryId" element={<BookListByCategory />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-info/:bookId" element={<BookInfo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/confirmed-loans" element={<ConfirmedLoans />} />

        <Route path="/fines" element={<FinesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin/loans" element={<AdminLoanManagement />} />
          <Route path="/admin/fines" element={<AdminFineManagement />} />
          <Route path="/admin/books" element={<AdminBookList />} />
          <Route path="/admin/fines" element={<AdminFineManagement />} />
        </Route>

        <Route path="/my-fines" element={<ProtectedRoute><MyFineList /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
