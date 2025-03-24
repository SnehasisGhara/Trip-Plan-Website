import { useState, useEffect } from "react";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_PHOTO_ACCESS_KEY;

const useFetchPhotoApi = (query) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query.trim() === "") return;

        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.unsplash.com/search/photos?query=hotel&per_page=30`,
                    {
                        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                    }
                );

                if (response.data.results.length > 0) {
                    // Get a random image from the results
                    const randomIndex = Math.floor(Math.random() * response.data.results.length);
                    setImageUrl(response.data.results[randomIndex].urls.regular);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [query]);

    return { imageUrl, loading, error };
};

export default useFetchPhotoApi;
