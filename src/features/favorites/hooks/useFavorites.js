
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getToken } from "../../../services/localStorageService";

export const useFavoriteIds = () => {
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const fetchFavorites = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8080/spring/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.code === 1000) {
                const ids = new Set(res.data.status.map(fav => fav.book.bookID));
                setFavoriteIds(ids);
            }
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return { favoriteIds, fetchFavorites, setFavoriteIds };
};

export const useToggleFavorite = () => {
    const toggle = async (bookId) => {
        const token = getToken();
        if (!token) return false;

        try {
            await axios.post(`http://localhost:8080/spring/favorites/${bookId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    return { toggle };
};
