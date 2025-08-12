import axios from 'axios';
import { getToken } from './localStorageService';

const API_BASE = 'http://localhost:8080/spring';

// Hàm tạo header chứa token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// CATEGORY APIs
export const getCategories = () => axios.get(`${API_BASE}/category`, authHeader());
export const createCategory = (data) => axios.post(`${API_BASE}/category`, data, authHeader());
export const updateCategory = (id, data) => axios.put(`${API_BASE}/category/${id}`, data, authHeader());
export const deleteCategory = (id) => axios.delete(`${API_BASE}/category/${id}`, authHeader());

// BOOK APIs
export const getBooksByCategory = (categoryId) =>
  axios.get(`${API_BASE}/books?categoryId=${categoryId}`, authHeader());
export const createBook = (data) => axios.post(`${API_BASE}/books`, data, authHeader());
export const updateBook = (id, data) => axios.put(`${API_BASE}/books/${id}`, data, authHeader());
export const deleteBook = (id) => axios.delete(`${API_BASE}/books/${id}`, authHeader());
