export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/spring/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  BOOKS: '/books',
  BOOK_DETAIL: '/books/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOANS: '/loans',
  FINES: '/fines',
  NOTIFICATIONS: '/notifications',
  CATEGORIES: '/categories',
};

export const NOTIFICATION_TYPES = {
  LOAN_DUE_SOON: 'LOAN_DUE_SOON',
  LOAN_OVERDUE: 'LOAN_OVERDUE',
  FINE_NOTICE: 'FINE_NOTICE',
  FINE_PAYMENT_DUE: 'FINE_PAYMENT_DUE',
};

export const LOAN_STATUS = {
  BORROWED: 'BORROWED',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
};

export const FINE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
};

export const TOAST_DURATION = 3000;
