// src/hooks/usePost.js
import { useState } from 'react';

const usePost = (url, method = 'POST') => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (data, customUrl = url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(customUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('La red no respondió de manera correcta');
            }
            const result = await response.json();
            return { status: response.status, data: result };
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { postData, loading, error };
};

export default usePost;