import { useState } from "react";

const useSecurePost = (url, method = 'POST') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
        
    const postData = async (body) => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, postData };
};

export default useSecurePost;