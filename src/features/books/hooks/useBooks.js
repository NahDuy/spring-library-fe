import { useState, useEffect } from "react";
import { getToken } from "../../../services/localStorageService";

const useBooks = (selectedCategory) => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:8080/spring/category", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                if (Array.isArray(data.status)) {
                    setCategories(data.status);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Books (depend on selectedCategory)
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const url = selectedCategory
                    ? `http://localhost:8080/spring/books/category/${selectedCategory}`
                    : "http://localhost:8080/spring/books";

                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });

                const data = await res.json();
                if (Array.isArray(data.status)) {
                    setBooks(data.status);
                } else {
                    setBooks([])
                }
            } catch (err) {
                console.error("Failed to fetch books:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [selectedCategory]);

    return { books, categories, loading, error, setBooks };
};

export default useBooks;
