import { useState, useEffect } from "react";
import { getToken } from "../../../services/localStorageService";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/spring/users/myInfo", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.status);
                }
            } catch (error) {
                console.error("Failed to fetch user info", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useAuth;
