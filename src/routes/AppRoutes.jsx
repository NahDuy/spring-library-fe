import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import CategoryList from '../components/categories/CategoryList';
import BookListByCategory from '../components/categories/BookListByCategory';
import BookDetail from '../components/books/BookDetail';
import Profile from "../components/Profile";
import BookInfo from "../components/books/BookInfo";
import Cart from "../components/books/Cart";   // <- Import trang Cart
import ConfirmedLoans from "../components/books/ConfirmedLoans";
import FinesPage from "../components/FinesPage";

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

      </Routes>
    </Router>
  );
};

export default AppRoutes;
